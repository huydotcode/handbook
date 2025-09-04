'use client';
import { useSocket } from '@/context/SocketContext';
import { videoCallSocketService } from '@/lib/services/videoCallSocket.service';
import { webRTCService } from '@/lib/services/webrtc.service';
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import toast from 'react-hot-toast';

interface VideoCallUser {
    _id: string;
    name: string;
    avatar?: string;
}

interface VideoCallContextType {
    isCallActive: boolean;
    currentCall: {
        participant: VideoCallUser;
        isIncoming: boolean;
        conversationId: string;
        isVideoCall: boolean; // true = video call, false = audio call
        callId?: string;
    } | null;
    callState: {
        isConnecting: boolean;
        isConnected: boolean;
        connectionState: RTCPeerConnectionState | null;
        isLoadingMedia: boolean;
    };
    startCall: (
        participant: VideoCallUser,
        conversationId: string,
        isVideoCall?: boolean
    ) => Promise<void>;
    acceptCall: () => void;
    rejectCall: () => void;
    endCall: () => void;
    // Media stream methods
    getLocalStream: () => MediaStream | null;
    getRemoteStream: () => MediaStream | null;
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(
    undefined
);

export const useVideoCall = () => {
    const context = useContext(VideoCallContext);
    if (!context) {
        throw new Error('useVideoCall must be used within a VideoCallProvider');
    }
    return context;
};

interface VideoCallProviderProps {
    children: ReactNode;
}

export const VideoCallProvider: React.FC<VideoCallProviderProps> = ({
    children,
}) => {
    const { socket } = useSocket();
    const [isCallActive, setIsCallActive] = useState(false);

    const [currentCall, setCurrentCall] = useState<{
        participant: VideoCallUser;
        isIncoming: boolean;
        conversationId: string;
        isVideoCall: boolean;
        callId?: string;
    } | null>(null);

    const [callState, setCallState] = useState({
        isConnecting: false,
        isConnected: false,
        connectionState: null as RTCPeerConnectionState | null,
        isLoadingMedia: false,
    });

    // Cleanup function
    const cleanup = useCallback(() => {
        webRTCService.cleanup();
        setCurrentCall(null);
        setIsCallActive(false);
        setCallState({
            isConnecting: false,
            isConnected: false,
            connectionState: null,
            isLoadingMedia: false,
        });
    }, []); // Xóa dependency

    // Initiate WebRTC connection (for call initiator)
    const initiateWebRTCConnection = useCallback(async () => {
        try {
            // Check if caller already has local stream (e.g., from enabling camera before accept)
            let stream = webRTCService.getLocalStream();

            if (!stream) {
                // Set loading media state only if we need to get media
                setCallState((prev) => ({ ...prev, isLoadingMedia: true }));

                // Get user media
                const constraints = currentCall?.isVideoCall
                    ? { video: true, audio: true }
                    : { video: false, audio: true };

                stream = await webRTCService.getUserMedia(constraints);

                webRTCService.addLocalStream(stream);

                // Clear loading media state
                setCallState((prev) => ({ ...prev, isLoadingMedia: false }));
            } else {
                // Ensure existing stream is added to peer connection
                webRTCService.addLocalStream(stream);
            }

            // Create and send offer
            const offer = await webRTCService.createOffer();

            if (currentCall?.callId && currentCall.participant._id) {
                videoCallSocketService.sendOffer({
                    callId: currentCall.callId,
                    targetUserId: currentCall.participant._id,
                    offer,
                });

                // Keep connecting state - will be cleared by WebRTC events when actually connected
            }
        } catch (error) {
            console.error('Error initiating WebRTC connection:', error);
            setCallState((prev) => ({ ...prev, isLoadingMedia: false }));
            cleanup();
        }
    }, [cleanup, currentCall]); // cleanup is stable

    // Setup socket event handlers
    const setupSocketEventHandlers = useCallback(() => {
        videoCallSocketService.setEventHandlers({
            onCallInitiated: (data) => {
                if (currentCall && !currentCall.isIncoming) {
                    setCurrentCall((prev) =>
                        prev ? { ...prev, callId: data.callId } : null
                    );
                    // Don't set isConnected yet - wait for actual WebRTC connection
                }
            },

            onIncomingCall: (data) => {
                // Xóa bỏ việc phát âm thanh
                setCurrentCall({
                    participant: data.initiator,
                    isIncoming: true,
                    conversationId: data.conversationId,
                    isVideoCall: data.isVideoCall,
                    callId: data.callId,
                });
                setIsCallActive(true);
            },

            onCallAccepted: async (data) => {
                // Xóa bỏ việc dừng âm thanh
                setCallState((prev) => ({ ...prev, isConnecting: true }));

                // If we are the initiator, start WebRTC signaling
                if (currentCall && !currentCall.isIncoming) {
                    await initiateWebRTCConnection();
                }

                // Fallback: Clear connecting state after 10 seconds if still connecting
                setTimeout(() => {
                    setCallState((prev) => {
                        if (prev.isConnecting && !prev.isConnected) {
                            return {
                                ...prev,
                                isConnecting: false,
                                isConnected: true,
                            };
                        }
                        return prev;
                    });
                }, 10000);
            },

            onCallRejected: (data) => {
                cleanup();
            },

            onCallEnded: (data) => {
                cleanup();
            },

            onCallError: (data) => {
                console.error('Video call error:', data);
                toast.error(`${data.error}`);
                cleanup();
            },

            onWebRTCOffer: async (data) => {
                try {
                    const answer = await webRTCService.handleOffer(data.offer);

                    if (currentCall?.callId) {
                        videoCallSocketService.sendAnswer({
                            callId: currentCall.callId,
                            targetUserId: data.fromUserId,
                            answer,
                        });
                    }
                } catch (error) {
                    console.error('Error handling WebRTC offer:', error);
                }
            },

            onWebRTCAnswer: async (data) => {
                try {
                    await webRTCService.handleAnswer(data.answer);
                } catch (error) {
                    console.error('Error handling WebRTC answer:', error);
                }
            },

            onWebRTCIceCandidate: async (data) => {
                try {
                    await webRTCService.addIceCandidate(data.candidate);
                } catch (error) {
                    console.error('Error adding ICE candidate:', error);
                }
            },
        });

        // Setup WebRTC event handlers
        webRTCService.setEventHandlers({
            onLocalStream: (stream) => {
                // Trigger re-render by updating state
                setCallState((prev) => ({ ...prev }));
            },

            onRemoteStream: (stream) => {
                // When we get remote stream, connection is essentially established
                setCallState((prev) => ({
                    ...prev,
                    isConnected: true,
                    isConnecting: false,
                }));
            },

            onConnectionStateChange: (state) => {
                const updates: any = {
                    connectionState: state,
                };

                // Set connected state
                if (state === 'connected') {
                    updates.isConnected = true;
                    updates.isConnecting = false;
                } else if (state === 'failed' || state === 'disconnected') {
                    updates.isConnected = false;
                    updates.isConnecting = false;
                }
                // For other states (new, connecting), don't change isConnecting

                setCallState((prev) => ({
                    ...prev,
                    ...updates,
                }));
            },

            onIceCandidate: (candidate) => {
                if (currentCall?.callId && currentCall.participant._id) {
                    videoCallSocketService.sendIceCandidate({
                        callId: currentCall.callId,
                        targetUserId: currentCall.participant._id,
                        candidate,
                    });
                }
            },

            onRenegotiationNeeded: (offer) => {
                // Handle renegotiation when tracks are added/removed dynamically
                if (currentCall?.callId && currentCall.participant._id) {
                    videoCallSocketService.sendOffer({
                        callId: currentCall.callId,
                        targetUserId: currentCall.participant._id,
                        offer,
                    });
                }
            },

            onError: (error) => {
                console.error('WebRTC error:', error);
                cleanup();
            },
        });
    }, [currentCall, initiateWebRTCConnection, cleanup]);

    // Initialize services when socket is available
    useEffect(() => {
        if (socket) {
            videoCallSocketService.initialize(socket as any);
            setupSocketEventHandlers();
        }

        return () => {
            videoCallSocketService.cleanup();
        };
    }, [socket, setupSocketEventHandlers]);

    const startCall = async (
        participant: VideoCallUser,
        conversationId: string,
        isVideoCall: boolean = true
    ) => {
        setCurrentCall({
            participant,
            isIncoming: false,
            conversationId,
            isVideoCall,
        });
        setIsCallActive(true);

        try {
            // Get user media for caller
            setCallState((prev) => ({ ...prev, isLoadingMedia: true }));

            const constraints = isVideoCall
                ? { video: true, audio: true }
                : { video: false, audio: true };

            const stream = await webRTCService.getUserMedia(constraints);
            webRTCService.addLocalStream(stream);

            setCallState((prev) => ({ ...prev, isLoadingMedia: false }));
        } catch (error) {
            console.error('Error getting caller media:', error);
            setCallState((prev) => ({ ...prev, isLoadingMedia: false }));
            // Xóa bỏ việc dừng âm thanh
            return; // Dừng hàm nếu có lỗi
        }

        // Xóa bỏ việc phát âm thanh

        // Send call initiation to server
        videoCallSocketService.initiateCall({
            conversationId,
            targetUserId: participant._id,
            isVideoCall,
        });
    };

    const acceptCall = async () => {
        // Xóa bỏ việc dừng âm thanh

        if (!currentCall?.callId) {
            console.error('No call to accept');
            return;
        }

        try {
            // Set loading state
            setCallState((prev) => ({ ...prev, isLoadingMedia: true }));

            // Get user media first
            const constraints = currentCall.isVideoCall
                ? { video: true, audio: true }
                : { video: false, audio: true };

            const stream = await webRTCService.getUserMedia(constraints);

            webRTCService.addLocalStream(stream);

            // Clear loading state after successful media access
            setCallState((prev) => ({
                ...prev,
                isLoadingMedia: false,
                isConnecting: true,
            }));

            // Accept the call via socket
            videoCallSocketService.acceptCall(currentCall.callId);
        } catch (error) {
            console.error('Error accepting call:', error);
            setCallState((prev) => ({ ...prev, isLoadingMedia: false }));
            cleanup();
        }
    };

    const rejectCall = () => {
        if (!currentCall?.callId) {
            console.error('No call to reject');
            return;
        }

        videoCallSocketService.rejectCall(currentCall.callId);
        cleanup();
    };

    const endCall = () => {
        if (currentCall?.callId) {
            videoCallSocketService.endCall(currentCall.callId);
        }
        cleanup();
    };

    const getLocalStream = () => {
        return webRTCService.getLocalStream();
    };

    const getRemoteStream = () => {
        return webRTCService.getRemoteStream();
    };

    useEffect(() => {
        console.log({
            currentCall,
        });
    }, [currentCall]);

    return (
        <VideoCallContext.Provider
            value={{
                isCallActive,
                currentCall,
                callState,
                startCall,
                acceptCall,
                rejectCall,
                endCall,
                getLocalStream,
                getRemoteStream,
            }}
        >
            {children}
        </VideoCallContext.Provider>
    );
};

export default VideoCallProvider;
