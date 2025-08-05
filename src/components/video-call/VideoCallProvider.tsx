'use client';

import React, { useState, useEffect } from 'react';
import {
    VideoCallProvider as VideoCallContextProvider,
    useVideoCall,
} from '@/context/VideoCallContext';
import { VideoCallModal } from './VideoCallModal';
import { useSocket } from '@/context/SocketContext';
import { VIDEO_CALL_EVENTS } from '@/constants/socketEvent.constant';
import { IncomingCallData } from '@/types/videoCall';
import toast from 'react-hot-toast';

interface VideoCallProviderProps {
    children: React.ReactNode;
}

// Component để quản lý modal dựa trên VideoCallContext state
const VideoCallModalManager: React.FC = () => {
    const { state } = useVideoCall();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [incomingCallData, setIncomingCallData] =
        useState<IncomingCallData | null>(null);
    const [targetUserData, setTargetUserData] = useState<
        | {
              _id: string;
              name: string;
              avatar?: string;
          }
        | undefined
    >(undefined);
    const { socket } = useSocket();

    // Hiển thị modal khi có cuộc gọi (calling, ringing, connected)
    useEffect(() => {
        const shouldShowModal = state.isInCall || state.callStatus !== 'idle';
        setIsModalOpen(shouldShowModal);
    }, [state.isInCall, state.callStatus]);

    useEffect(() => {
        if (!socket) return;

        const handleIncomingCall = (data: IncomingCallData) => {
            setIncomingCallData(data);
            setIsModalOpen(true);
        };

        const handleCallEnded = () => {
            setIsModalOpen(false);
            setIncomingCallData(null);
        };

        const handleCallRejected = () => {
            setIsModalOpen(false);
            setIncomingCallData(null);
        };

        socket.on(VIDEO_CALL_EVENTS.INCOMING_VIDEO_CALL, handleIncomingCall);
        socket.on(VIDEO_CALL_EVENTS.VIDEO_CALL_ENDED, handleCallEnded);
        socket.on(VIDEO_CALL_EVENTS.VIDEO_CALL_REJECTED, handleCallRejected);

        return () => {
            socket.off(
                VIDEO_CALL_EVENTS.INCOMING_VIDEO_CALL,
                handleIncomingCall
            );
            socket.off(VIDEO_CALL_EVENTS.VIDEO_CALL_ENDED, handleCallEnded);
            socket.off(
                VIDEO_CALL_EVENTS.VIDEO_CALL_REJECTED,
                handleCallRejected
            );
        };
    }, [socket]);

    useEffect(() => {
        if (isModalOpen && incomingCallData) {
            toast.success(`Cuộc gọi đến từ ${incomingCallData.caller.name}`);
        }
    }, [isModalOpen, incomingCallData]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIncomingCallData(null);
    };

    // Xác định caller dựa trên call status
    const caller =
        state.callStatus === 'ringing' ? incomingCallData?.caller : undefined;
    const targetUser =
        state.callStatus === 'calling' ? targetUserData : undefined;

    return (
        <VideoCallModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            caller={caller || targetUser}
        />
    );
};

export const VideoCallProvider: React.FC<VideoCallProviderProps> = ({
    children,
}) => {
    return (
        <VideoCallContextProvider>
            {children}
            <VideoCallModalManager />
        </VideoCallContextProvider>
    );
};
