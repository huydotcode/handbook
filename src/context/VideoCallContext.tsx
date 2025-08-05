'use client';

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useRef,
} from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from './SocketContext';
import { VIDEO_CALL_EVENTS } from '../constants/socketEvent.constant';
import {
    VideoCallState,
    VideoCallSignal,
    IncomingCallData,
} from '../types/videoCall';
import Peer from 'simple-peer';

interface VideoCallContextType {
    state: VideoCallState;
    initiateCall: (targetUserId: string) => void;
    acceptCall: (roomId: string) => void;
    rejectCall: (roomId: string) => void;
    endCall: () => void;
    toggleMute: () => void;
    toggleVideo: () => void;
    toggleScreenShare: () => void;
    sendSignal: (signal: VideoCallSignal) => void;
}

const initialState: VideoCallState = {
    isInCall: false,
    roomId: null,
    participants: [],
    localStream: null,
    remoteStreams: new Map(),
    isMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
    callStatus: 'idle',
};

type VideoCallAction =
    | { type: 'SET_CALL_STATUS'; payload: VideoCallState['callStatus'] }
    | { type: 'SET_ROOM_ID'; payload: string | null }
    | { type: 'SET_PARTICIPANTS'; payload: string[] }
    | { type: 'SET_LOCAL_STREAM'; payload: MediaStream | null }
    | {
          type: 'ADD_REMOTE_STREAM';
          payload: { userId: string; stream: MediaStream };
      }
    | { type: 'REMOVE_REMOTE_STREAM'; payload: string }
    | { type: 'TOGGLE_MUTE' }
    | { type: 'TOGGLE_VIDEO' }
    | { type: 'TOGGLE_SCREEN_SHARE' }
    | { type: 'RESET_CALL' };

const videoCallReducer = (
    state: VideoCallState,
    action: VideoCallAction
): VideoCallState => {
    console.log('VideoCall Reducer - Action:', action.type, action);
    switch (action.type) {
        case 'SET_CALL_STATUS':
            console.log(
                'Setting call status from',
                state.callStatus,
                'to',
                action.payload
            );
            return { ...state, callStatus: action.payload };
        case 'SET_ROOM_ID':
            return {
                ...state,
                roomId: action.payload,
                isInCall: !!action.payload,
            };
        case 'SET_PARTICIPANTS':
            return { ...state, participants: action.payload };
        case 'SET_LOCAL_STREAM':
            return { ...state, localStream: action.payload };
        case 'ADD_REMOTE_STREAM':
            const newRemoteStreams = new Map(state.remoteStreams);
            newRemoteStreams.set(action.payload.userId, action.payload.stream);
            return { ...state, remoteStreams: newRemoteStreams };
        case 'REMOVE_REMOTE_STREAM':
            const updatedRemoteStreams = new Map(state.remoteStreams);
            updatedRemoteStreams.delete(action.payload);
            return { ...state, remoteStreams: updatedRemoteStreams };
        case 'TOGGLE_MUTE':
            return { ...state, isMuted: !state.isMuted };
        case 'TOGGLE_VIDEO':
            return { ...state, isVideoOff: !state.isVideoOff };
        case 'TOGGLE_SCREEN_SHARE':
            return { ...state, isScreenSharing: !state.isScreenSharing };
        case 'RESET_CALL':
            return initialState;
        default:
            return state;
    }
};

const VideoCallContext = createContext<VideoCallContextType | undefined>(
    undefined
);

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(videoCallReducer, initialState);
    const { data: session } = useSession();
    const { socket } = useSocket();
    const peersRef = useRef<Map<string, Peer.Instance>>(new Map());
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (!socket || !session?.user?.id) return;

        console.log('VideoCallContext: Socket connected:', socket.connected);
        console.log('VideoCallContext: User ID:', session?.user?.id);

        // Define event handlers
        const handleIncomingCall = (data: IncomingCallData) => {
            dispatch({ type: 'SET_CALL_STATUS', payload: 'ringing' });
            dispatch({ type: 'SET_ROOM_ID', payload: data.roomId });
            dispatch({
                type: 'SET_PARTICIPANTS',
                payload: [data.caller._id],
            });
        };

        const handleCallInitiated = ({ roomId }: { roomId: string }) => {
            dispatch({ type: 'SET_CALL_STATUS', payload: 'calling' });
            dispatch({ type: 'SET_ROOM_ID', payload: roomId });
        };

        const handleCallAccepted = ({ roomId }: { roomId: string }) => {
            console.log(
                'Socket received video-call-accepted event for room:',
                roomId,
                'Current status:',
                state.callStatus
            );
            console.log('Dispatching SET_CALL_STATUS: connected');
            dispatch({ type: 'SET_CALL_STATUS', payload: 'connected' });
            dispatch({ type: 'SET_ROOM_ID', payload: roomId });
            console.log('Call status updated to connected');
        };

        const handleCallRejected = () => {
            dispatch({ type: 'RESET_CALL' });
        };

        const handleCallEnded = () => {
            dispatch({ type: 'RESET_CALL' });
        };

        const handleSignal = (signal: VideoCallSignal) => {
            console.log('Socket received signal event:', signal);
            console.log(
                'Current user ID:',
                session?.user?.id,
                'Signal to:',
                signal.to
            );
            if (signal.to === session?.user?.id) {
                console.log('Signal is for current user, processing...');
                handleVideoCallSignal(signal);
            } else {
                console.log('Signal is not for current user, ignoring...');
            }
        };

        const handleVideoCallError = ({ message }: { message: string }) => {
            console.error('Video call error:', message);
            dispatch({ type: 'RESET_CALL' });
        };

        const handleParticipantLeft = ({ roomId }: { roomId: string }) => {
            console.log('=== PARTICIPANT LEFT EVENT ===');
            console.log('Participant left event received for room:', roomId);
            console.log('Current call status:', state.callStatus);
            console.log('Current user ID:', session?.user?.id);
            console.log('Socket connected:', socket?.connected);
            console.log('==============================');

            // Only reset if we're actually in a call
            if (
                state.callStatus === 'connected' ||
                state.callStatus === 'ringing' ||
                state.callStatus === 'calling'
            ) {
                dispatch({ type: 'SET_CALL_STATUS', payload: 'ended' });
                setTimeout(() => {
                    console.log('Resetting call after participant left');
                    dispatch({ type: 'RESET_CALL' });
                }, 2000);
            } else {
                console.log(
                    'Ignoring participant left event - not in active call'
                );
            }
        };

        // Listen for incoming video calls
        socket.on(VIDEO_CALL_EVENTS.INCOMING_VIDEO_CALL, handleIncomingCall);

        // Listen for call initiated
        socket.on(VIDEO_CALL_EVENTS.VIDEO_CALL_INITIATED, handleCallInitiated);

        // Listen for call accepted
        socket.on(VIDEO_CALL_EVENTS.VIDEO_CALL_ACCEPTED, handleCallAccepted);
        console.log(
            'Listening for video-call-accepted event:',
            VIDEO_CALL_EVENTS.VIDEO_CALL_ACCEPTED
        );

        console.log('Socket event listeners set up for video call events');

        // Listen for call rejected
        socket.on(VIDEO_CALL_EVENTS.VIDEO_CALL_REJECTED, handleCallRejected);

        // Listen for call ended
        socket.on(VIDEO_CALL_EVENTS.VIDEO_CALL_ENDED, handleCallEnded);

        // Listen for video call signals
        socket.on(VIDEO_CALL_EVENTS.VIDEO_CALL_SIGNAL, handleSignal);

        // Listen for video call errors
        socket.on(VIDEO_CALL_EVENTS.VIDEO_CALL_ERROR, handleVideoCallError);

        // Listen for participant left
        socket.on(
            VIDEO_CALL_EVENTS.VIDEO_CALL_PARTICIPANT_LEFT,
            handleParticipantLeft
        );

        // Listen for socket disconnect/reconnect
        const handleSocketDisconnect = () => {
            console.log('=== SOCKET DISCONNECTED ===');
            console.log('VideoCallContext: Socket disconnected');
            console.log('Current call status:', state.callStatus);
            console.log('==========================');
        };

        const handleSocketConnect = () => {
            console.log('=== SOCKET RECONNECTED ===');
            console.log('VideoCallContext: Socket reconnected');
            console.log('Current call status:', state.callStatus);
            console.log('==========================');
        };

        socket.on('disconnect', handleSocketDisconnect);
        socket.on('connect', handleSocketConnect);

        return () => {
            if (socket) {
                socket.off(
                    VIDEO_CALL_EVENTS.INCOMING_VIDEO_CALL,
                    handleIncomingCall
                );
                socket.off(
                    VIDEO_CALL_EVENTS.VIDEO_CALL_INITIATED,
                    handleCallInitiated
                );
                socket.off(
                    VIDEO_CALL_EVENTS.VIDEO_CALL_ACCEPTED,
                    handleCallAccepted
                );
                socket.off(
                    VIDEO_CALL_EVENTS.VIDEO_CALL_REJECTED,
                    handleCallRejected
                );
                socket.off(VIDEO_CALL_EVENTS.VIDEO_CALL_ENDED, handleCallEnded);
                socket.off(VIDEO_CALL_EVENTS.VIDEO_CALL_SIGNAL, handleSignal);
                socket.off(
                    VIDEO_CALL_EVENTS.VIDEO_CALL_ERROR,
                    handleVideoCallError
                );
                socket.off(
                    VIDEO_CALL_EVENTS.VIDEO_CALL_PARTICIPANT_LEFT,
                    handleParticipantLeft
                );
                socket.off('disconnect', handleSocketDisconnect);
                socket.off('connect', handleSocketConnect);
            }
        };
    }, [socket, session?.user?.id]);

    const handleVideoCallSignal = async (signal: VideoCallSignal) => {
        console.log(
            'Received signal:',
            signal.type,
            'from:',
            signal.from,
            'to:',
            signal.to,
            'Current user ID:',
            session?.user?.id
        );
        const peer = peersRef.current.get(signal.from);
        if (peer) {
            console.log('Found existing peer, signaling with data');
            peer.signal(signal.data);
        } else {
            // If peer doesn't exist, create one for incoming signals
            console.log(
                'Creating new peer for incoming signal from:',
                signal.from
            );
            const localStream = await getLocalStream();
            const newPeer = new Peer({
                initiator: false,
                trickle: false,
                stream: localStream,
            });
            console.log('New peer created for signal from:', signal.from);

            newPeer.on('signal', (data) => {
                console.log(
                    'New peer signal event triggered, sending response'
                );
                const responseType =
                    signal.type === 'offer' ? 'answer' : 'offer';
                console.log(
                    'Signal type:',
                    signal.type,
                    'Response type:',
                    responseType
                );
                sendSignal({
                    type: responseType,
                    to: signal.from,
                    from: session?.user?.id || '',
                    data,
                });
            });

            newPeer.on('stream', (remoteStream) => {
                console.log('Received remote stream from signal:', signal.from);
                dispatch({
                    type: 'ADD_REMOTE_STREAM',
                    payload: { userId: signal.from, stream: remoteStream },
                });
            });

            peersRef.current.set(signal.from, newPeer);
            console.log('Signaling peer with data:', signal.data);
            newPeer.signal(signal.data);
        }
    };

    const getLocalStream = async (): Promise<MediaStream> => {
        if (localStreamRef.current) {
            return localStreamRef.current;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            localStreamRef.current = stream;
            dispatch({ type: 'SET_LOCAL_STREAM', payload: stream });
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    };

    const initiateCall = async (targetUserId: string) => {
        try {
            const localStream = await getLocalStream();
            socket?.emit(VIDEO_CALL_EVENTS.INITIATE_VIDEO_CALL, {
                targetUserId,
            });

            // Create peer connection for the target user
            if (!peersRef.current.has(targetUserId)) {
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: localStream,
                });

                peer.on('signal', (data) => {
                    sendSignal({
                        type: 'offer',
                        to: targetUserId,
                        from: session?.user?.id || '',
                        data,
                    });
                });

                peer.on('stream', (remoteStream) => {
                    console.log('Received remote stream from:', targetUserId);
                    dispatch({
                        type: 'ADD_REMOTE_STREAM',
                        payload: { userId: targetUserId, stream: remoteStream },
                    });
                });

                peersRef.current.set(targetUserId, peer);
            }
        } catch (error) {
            console.error('Error initiating call:', error);
        }
    };

    const acceptCall = async (roomId: string) => {
        try {
            console.log('Accepting call for room:', roomId);

            // Check if already processing this call
            if (
                state.callStatus === 'connected' ||
                state.callStatus === 'calling'
            ) {
                console.log('Already processing call, skipping...');
                return;
            }

            const localStream = await getLocalStream();
            console.log('Got local stream, emitting accept call events');
            socket?.emit(VIDEO_CALL_EVENTS.ACCEPT_VIDEO_CALL, { roomId });
            socket?.emit(VIDEO_CALL_EVENTS.JOIN_VIDEO_ROOM, { roomId });

            // Create peer connection for the caller
            const callerId = state.participants[0];
            console.log('Creating peer connection for caller:', callerId);
            if (callerId && !peersRef.current.has(callerId)) {
                const peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream: localStream,
                });

                peer.on('connect', () => {
                    console.log(
                        'Peer connection established with caller:',
                        callerId
                    );
                });

                peer.on('error', (err) => {
                    console.error('Peer connection error:', err);
                });

                peer.on('signal', (data) => {
                    console.log(
                        'Peer signal event triggered, sending answer signal to:',
                        callerId,
                        'Signal data:',
                        data
                    );
                    sendSignal({
                        type: 'answer',
                        to: callerId,
                        from: session?.user?.id || '',
                        data,
                    });
                });

                peer.on('stream', (remoteStream) => {
                    console.log(
                        'Received remote stream from caller:',
                        callerId,
                        'Stream tracks:',
                        remoteStream.getTracks().map((t) => t.kind)
                    );
                    console.log('Remote stream active:', remoteStream.active);
                    dispatch({
                        type: 'ADD_REMOTE_STREAM',
                        payload: { userId: callerId, stream: remoteStream },
                    });
                });

                peersRef.current.set(callerId, peer);
                console.log(
                    'Peer connection created and stored for caller:',
                    callerId
                );
            }
        } catch (error) {
            console.error('Error accepting call:', error);
        }
    };

    const rejectCall = (roomId: string) => {
        socket?.emit(VIDEO_CALL_EVENTS.REJECT_VIDEO_CALL, { roomId });
        dispatch({ type: 'RESET_CALL' });
    };

    const endCall = () => {
        if (state.roomId) {
            socket?.emit(VIDEO_CALL_EVENTS.END_VIDEO_CALL, {
                roomId: state.roomId,
            });
            socket?.emit(VIDEO_CALL_EVENTS.LEAVE_VIDEO_ROOM, {
                roomId: state.roomId,
            });
        }

        // Clean up streams and peers
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }

        // Clean up remote streams
        state.remoteStreams.forEach((stream) => {
            stream.getTracks().forEach((track) => track.stop());
        });

        peersRef.current.forEach((peer) => peer.destroy());
        peersRef.current.clear();

        dispatch({ type: 'RESET_CALL' });
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                dispatch({ type: 'TOGGLE_MUTE' });
            }
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                dispatch({ type: 'TOGGLE_VIDEO' });
            }
        }
    };

    const toggleScreenShare = async () => {
        try {
            if (state.isScreenSharing) {
                // Stop screen sharing
                const stream = await getLocalStream();
                dispatch({ type: 'SET_LOCAL_STREAM', payload: stream });
            } else {
                // Start screen sharing
                const screenStream =
                    await navigator.mediaDevices.getDisplayMedia({
                        video: true,
                        audio: false,
                    });
                dispatch({ type: 'SET_LOCAL_STREAM', payload: screenStream });
            }
            dispatch({ type: 'TOGGLE_SCREEN_SHARE' });
        } catch (error) {
            console.error('Error toggling screen share:', error);
        }
    };

    const sendSignal = (signal: VideoCallSignal) => {
        if (socket) {
            console.log(
                'Sending signal:',
                signal.type,
                'to:',
                signal.to,
                'from:',
                signal.from
            );
            socket.emit(VIDEO_CALL_EVENTS.VIDEO_CALL_SIGNAL, { signal });
        } else {
            console.error('Socket not available for sending signal');
        }
    };

    useEffect(() => {
        console.log('VideoCall State:', state);
        console.log('Call status:', state.callStatus);
        console.log('Remote streams count:', state.remoteStreams.size);
        console.log('Local stream:', !!state.localStream);
        console.log('Is in call:', state.isInCall);
        console.log('Room ID:', state.roomId);
    }, [state]);

    const value: VideoCallContextType = {
        state,
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleScreenShare,
        sendSignal,
    };

    return (
        <VideoCallContext.Provider value={value}>
            {children}
        </VideoCallContext.Provider>
    );
};

export const useVideoCall = () => {
    const context = useContext(VideoCallContext);
    if (context === undefined) {
        throw new Error('useVideoCall must be used within a VideoCallProvider');
    }
    return context;
};
