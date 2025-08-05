'use client';

import React from 'react';
import { useVideoCall } from '@/context/VideoCallContext';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui';

interface VideoCallButtonProps {
    targetUserId: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'outline' | 'ghost';
}

export const VideoCallButton: React.FC<VideoCallButtonProps> = ({
    targetUserId,
    className = '',
    size = 'md',
    variant = 'default',
}) => {
    const { state, initiateCall } = useVideoCall();

    const handleVideoCall = () => {
        if (state.isInCall) {
            // Show notification that user is already in a call
            return;
        }
        initiateCall(targetUserId);
    };

    const sizeClasses = {
        sm: 'p-2',
        md: 'p-3',
        lg: 'p-4',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <Button
            onClick={handleVideoCall}
            disabled={state.isInCall}
            className={`${sizeClasses[size]} ${className}`}
            variant={variant}
            title="Gọi video"
        >
            <Icons.Video className={iconSizes[size]} />
        </Button>
    );
};
