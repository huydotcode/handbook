'use client';
import React from 'react';
import { useVideoCall } from '@/context/VideoCallContext';
import VideoCallModal from './VideoCallModal';

const VideoCallWrapper: React.FC = () => {
    const { isCallActive, currentCall, endCall } = useVideoCall();

    if (!isCallActive || !currentCall) {
        return null;
    }

    return (
        <VideoCallModal
            isOpen={isCallActive}
            onClose={endCall}
            participant={currentCall.participant}
            isIncoming={currentCall.isIncoming}
            isVideoCall={currentCall.isVideoCall}
        />
    );
};

export default VideoCallWrapper;
