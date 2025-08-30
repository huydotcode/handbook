import { Socket } from 'socket.io-client';
import socketEvent from '@/constants/socketEvent.constant';

export interface VideoCallUser {
    _id: string;
    name: string;
    avatar?: string;
}

export interface VideoCallInitiateData {
    conversationId: string;
    targetUserId: string;
    isVideoCall: boolean;
}

export interface VideoCallOfferData {
    callId: string;
    targetUserId: string;
    offer: RTCSessionDescriptionInit;
}

export interface VideoCallAnswerData {
    callId: string;
    targetUserId: string;
    answer: RTCSessionDescriptionInit;
}

export interface VideoCallIceCandidateData {
    callId: string;
    targetUserId: string;
    candidate: RTCIceCandidateInit;
}

export interface VideoCallEventHandlers {
    onCallInitiated?: (data: { callId: string; status: string }) => void;
    onIncomingCall?: (data: {
        callId: string;
        conversationId: string;
        isVideoCall: boolean;
        initiator: VideoCallUser;
    }) => void;
    onCallAccepted?: (data: {
        callId: string;
        participants: Array<{
            userId: string;
            isVideoEnabled: boolean;
            isAudioEnabled: boolean;
        }>;
    }) => void;
    onCallRejected?: (data: { callId: string; rejectedBy: string }) => void;
    onCallEnded?: (data: { callId: string; endedBy: string }) => void;
    onCallError?: (data: { error: string }) => void;
    onWebRTCOffer?: (data: {
        callId: string;
        fromUserId: string;
        offer: RTCSessionDescriptionInit;
    }) => void;
    onWebRTCAnswer?: (data: {
        callId: string;
        fromUserId: string;
        answer: RTCSessionDescriptionInit;
    }) => void;
    onWebRTCIceCandidate?: (data: {
        callId: string;
        fromUserId: string;
        candidate: RTCIceCandidateInit;
    }) => void;
    onParticipantJoined?: (data: { callId: string; userId: string }) => void;
    onParticipantLeft?: (data: { callId: string; userId: string }) => void;
}

class VideoCallSocketService {
    private socket: Socket | null = null;
    private handlers: VideoCallEventHandlers = {};

    /**
     * Initialize the service with socket instance
     */
    initialize(socket: Socket) {
        this.socket = socket;
        this.setupEventListeners();
    }

    /**
     * Set event handlers for video call events
     */
    setEventHandlers(handlers: VideoCallEventHandlers) {
        this.handlers = { ...this.handlers, ...handlers };
    }

    /**
     * Setup socket event listeners
     */
    private setupEventListeners() {
        if (!this.socket) return;

        // Call initiated successfully
        this.socket.on('video-call-initiated', (data) => {
            console.log('Call initiated:', data);
            this.handlers.onCallInitiated?.(data);
        });

        // Incoming call
        this.socket.on(socketEvent.VIDEO_CALL_INITIATE, (data) => {
            console.log('Incoming call:', data);
            this.handlers.onIncomingCall?.(data);
        });

        // Call accepted
        this.socket.on(socketEvent.VIDEO_CALL_ACCEPT, (data) => {
            console.log('Call accepted:', data);
            this.handlers.onCallAccepted?.(data);
        });

        // Call rejected
        this.socket.on(socketEvent.VIDEO_CALL_REJECT, (data) => {
            console.log('Call rejected:', data);
            this.handlers.onCallRejected?.(data);
        });

        // Call ended
        this.socket.on(socketEvent.VIDEO_CALL_END, (data) => {
            console.log('Call ended:', data);
            this.handlers.onCallEnded?.(data);
        });

        // Call error
        this.socket.on('video-call-error', (data) => {
            console.error('Video call error:', data);
            this.handlers.onCallError?.(data);
        });

        // WebRTC signaling events
        this.socket.on(socketEvent.VIDEO_CALL_OFFER, (data) => {
            console.log('Received WebRTC offer:', data);
            this.handlers.onWebRTCOffer?.(data);
        });

        this.socket.on(socketEvent.VIDEO_CALL_ANSWER, (data) => {
            console.log('Received WebRTC answer:', data);
            this.handlers.onWebRTCAnswer?.(data);
        });

        this.socket.on(socketEvent.VIDEO_CALL_ICE_CANDIDATE, (data) => {
            console.log('Received ICE candidate:', data);
            this.handlers.onWebRTCIceCandidate?.(data);
        });

        // Participant events
        this.socket.on(socketEvent.VIDEO_CALL_PARTICIPANT_JOINED, (data) => {
            console.log('Participant joined:', data);
            this.handlers.onParticipantJoined?.(data);
        });

        this.socket.on(socketEvent.VIDEO_CALL_PARTICIPANT_LEFT, (data) => {
            console.log('Participant left:', data);
            this.handlers.onParticipantLeft?.(data);
        });
    }

    /**
     * Initiate a video/audio call
     */
    initiateCall(data: VideoCallInitiateData) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }
        
        console.log('Initiating call:', data);
        this.socket.emit(socketEvent.VIDEO_CALL_INITIATE, data);
    }

    /**
     * Accept an incoming call
     */
    acceptCall(callId: string) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        console.log('Accepting call:', callId);
        this.socket.emit(socketEvent.VIDEO_CALL_ACCEPT, { callId });
    }

    /**
     * Reject an incoming call
     */
    rejectCall(callId: string) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        console.log('Rejecting call:', callId);
        this.socket.emit(socketEvent.VIDEO_CALL_REJECT, { callId });
    }

    /**
     * End an active call
     */
    endCall(callId: string) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        console.log('Ending call:', callId);
        this.socket.emit(socketEvent.VIDEO_CALL_END, { callId });
    }

    /**
     * Send WebRTC offer
     */
    sendOffer(data: VideoCallOfferData) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        console.log('Sending WebRTC offer:', data);
        this.socket.emit(socketEvent.VIDEO_CALL_OFFER, data);
    }

    /**
     * Send WebRTC answer
     */
    sendAnswer(data: VideoCallAnswerData) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        console.log('Sending WebRTC answer:', data);
        this.socket.emit(socketEvent.VIDEO_CALL_ANSWER, data);
    }

    /**
     * Send ICE candidate
     */
    sendIceCandidate(data: VideoCallIceCandidateData) {
        if (!this.socket) {
            console.error('Socket not initialized');
            return;
        }

        // Don't log ICE candidates to avoid spam
        this.socket.emit(socketEvent.VIDEO_CALL_ICE_CANDIDATE, data);
    }

    /**
     * Cleanup event listeners
     */
    cleanup() {
        if (!this.socket) return;

        // Remove all video call event listeners
        this.socket.off('video-call-initiated');
        this.socket.off(socketEvent.VIDEO_CALL_INITIATE);
        this.socket.off(socketEvent.VIDEO_CALL_ACCEPT);
        this.socket.off(socketEvent.VIDEO_CALL_REJECT);
        this.socket.off(socketEvent.VIDEO_CALL_END);
        this.socket.off('video-call-error');
        this.socket.off(socketEvent.VIDEO_CALL_OFFER);
        this.socket.off(socketEvent.VIDEO_CALL_ANSWER);
        this.socket.off(socketEvent.VIDEO_CALL_ICE_CANDIDATE);
        this.socket.off(socketEvent.VIDEO_CALL_PARTICIPANT_JOINED);
        this.socket.off(socketEvent.VIDEO_CALL_PARTICIPANT_LEFT);
    }

    /**
     * Check if socket is connected
     */
    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}

export const videoCallSocketService = new VideoCallSocketService();
export default VideoCallSocketService;
