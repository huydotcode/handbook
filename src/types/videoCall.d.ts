export interface VideoCallRoom {
    id: string;
    participants: string[];
    initiator: string;
    status: 'waiting' | 'active' | 'ended';
    startTime?: Date;
    endTime?: Date;
}

export interface VideoCallSignal {
    type: 'offer' | 'answer' | 'ice-candidate' | 'hangup';
    data: any;
    from: string;
    to: string;
}

export interface VideoCallState {
    isInCall: boolean;
    roomId: string | null;
    participants: string[];
    localStream: MediaStream | null;
    remoteStreams: Map<string, MediaStream>;
    isMuted: boolean;
    isVideoOff: boolean;
    isScreenSharing: boolean;
    callStatus: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
}

export interface IncomingCallData {
    roomId: string;
    caller: {
        _id: string;
        name: string;
        avatar?: string;
    };
}

export interface VideoCallNotification {
    type: string;
    message: string;
    roomId?: string;
    sender: {
        _id: string;
        name: string;
        avatar?: string;
    };
}
