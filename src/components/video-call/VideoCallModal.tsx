'use client';

import React, { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useVideoCall } from '@/context/VideoCallContext';
import { Button } from '@/components/ui/Button';
import { Avatar, Icons } from '@/components/ui';
import toast from 'react-hot-toast';

interface VideoCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    caller?: {
        _id: string;
        name: string;
        avatar?: string;
    };
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
    isOpen,
    onClose,
    caller,
}) => {
    const {
        state,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleScreenShare,
    } = useVideoCall();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const setLocalVideo = useCallback(() => {
        if (state.localStream && localVideoRef.current) {
            console.log('VideoCallModal: Setting srcObject for local video');
            console.log('VideoCallModal: Local stream tracks:', state.localStream.getTracks().map(t => t.kind));
            localVideoRef.current.srcObject = state.localStream;
            localVideoRef.current.play().catch((error) => {
                console.error('Error playing local video:', error);
            });
        } else {
            console.log('VideoCallModal: Cannot set local video - stream:', !!state.localStream, 'ref:', !!localVideoRef.current);
        }
    }, [state.localStream]);

    useLayoutEffect(() => {
        console.log('VideoCallModal: Setting local stream:', state.localStream);
        setLocalVideo();
    }, [state.localStream, setLocalVideo]);

    useEffect(() => {
        console.log(
            'VideoCallModal: Remote streams:',
            state.remoteStreams.size
        );
        if (state.remoteStreams.size > 0 && remoteVideoRef.current) {
            const firstRemoteStream = Array.from(
                state.remoteStreams.values()
            )[0];
            console.log('VideoCallModal: Setting srcObject for remote video');
            remoteVideoRef.current.srcObject = firstRemoteStream;
            // Ensure video plays
            remoteVideoRef.current.play().catch((error) => {
                console.error('Error playing remote video:', error);
            });
        }
    }, [state.remoteStreams]);

    useEffect(() => {
        if (state.callStatus === 'connected') {
            toast.success('Kết nối video thành công');
        }
    }, [state.callStatus]);

    useEffect(() => {
        console.log('VideoCallModal Debug:', {
            localVideoRef: localVideoRef.current,
            remoteVideoRef: remoteVideoRef.current,
            localStream: state.localStream,
            remoteStreams: state.remoteStreams,
            localStreamTracks: state.localStream
                ?.getTracks()
                .map((t) => t.kind),
            remoteStreamsCount: state.remoteStreams.size,
        });
    }, [state.localStream, state.remoteStreams]);

    if (!isOpen) return null;

    const handleAcceptCall = () => {
        if (state.roomId) {
            acceptCall(state.roomId);
        }
    };

    const handleRejectCall = () => {
        if (state.roomId) {
            rejectCall(state.roomId);
        }
        onClose();
    };

    const handleEndCall = () => {
        endCall();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="relative h-full max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg bg-gray-900">
                {/* Video Container */}
                <div className="relative h-full w-full">
                    {/* Remote Video */}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover"
                    />

                    {/* Local Video */}
                    <div className="absolute right-4 top-4 h-36 w-48 overflow-hidden rounded-lg bg-gray-800 z-10">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="h-full w-full object-cover"
                            style={{ transform: 'scaleX(-1)' }} // Mirror the video
                        />
                        {!state.localStream && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                                <span className="text-white">
                                    Video không khả dụng
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Call Status Overlay */}
                    {(state.callStatus === 'ringing' ||
                        state.callStatus === 'calling') && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="text-center text-white">
                                {caller?.avatar && (
                                    <Avatar
                                        imgSrc={caller?.avatar || ''}
                                        className="mx-auto mb-4 h-24 w-24"
                                    />
                                )}
                                <h3 className="mb-2 text-xl font-semibold">
                                    {state.callStatus === 'ringing'
                                        ? `${caller?.name} đang gọi video`
                                        : `Đang gọi ${caller?.name}`}
                                </h3>
                                <p className="mb-6 text-gray-300">
                                    Đang kết nối...
                                </p>
                                <div className="flex justify-center gap-4">
                                    {state.callStatus === 'ringing' ? (
                                        <>
                                            <Button
                                                onClick={handleAcceptCall}
                                                className="rounded-full bg-green-500 px-6 py-3 text-white hover:bg-green-600"
                                            >
                                                <Icons.Phone className="mr-2 h-5 w-5" />
                                                Trả lời
                                            </Button>
                                            <Button
                                                onClick={handleRejectCall}
                                                className="rounded-full bg-red-500 px-6 py-3 text-white hover:bg-red-600"
                                            >
                                                <Icons.PhoneOff className="mr-2 h-5 w-5" />
                                                Từ chối
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={handleEndCall}
                                            className="rounded-full bg-red-500 px-6 py-3 text-white hover:bg-red-600"
                                        >
                                            <Icons.PhoneOff className="mr-2 h-5 w-5" />
                                            Kết thúc
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Connection Status */}
                    {state.callStatus === 'connected' &&
                        state.remoteStreams.size === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="text-center text-white">
                                    <div className="bg-blue-500 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                        <Icons.Phone className="h-8 w-8 animate-pulse text-white" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">
                                        Đang kết nối video...
                                    </h3>
                                    <p className="text-gray-300">
                                        Vui lòng chờ trong giây lát
                                    </p>
                                </div>
                            </div>
                        )}

                    {/* Call Controls */}
                    {state.callStatus === 'connected' && (
                        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform gap-4">
                            <Button
                                onClick={toggleMute}
                                className={`rounded-full p-4 ${
                                    state.isMuted
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                } text-white`}
                            >
                                {state.isMuted ? (
                                    <Icons.MicOff className="h-6 w-6" />
                                ) : (
                                    <Icons.Mic className="h-6 w-6" />
                                )}
                            </Button>

                            <Button
                                onClick={toggleVideo}
                                className={`rounded-full p-4 ${
                                    state.isVideoOff
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                } text-white`}
                            >
                                {state.isVideoOff ? (
                                    <Icons.VideoOff className="h-6 w-6" />
                                ) : (
                                    <Icons.Video className="h-6 w-6" />
                                )}
                            </Button>

                            <Button
                                onClick={toggleScreenShare}
                                className={`rounded-full p-4 ${
                                    state.isScreenSharing
                                        ? 'bg-blue-500 hover:bg-blue-600'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                } text-white`}
                            >
                                <Icons.Monitor className="h-6 w-6" />
                            </Button>

                            <Button
                                onClick={handleEndCall}
                                className="rounded-full bg-red-500 p-4 text-white hover:bg-red-600"
                            >
                                <Icons.PhoneOff className="h-6 w-6" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
