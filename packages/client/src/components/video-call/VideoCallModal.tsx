'use client';
import { Avatar, Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useVideoCall } from '@/context/VideoCallContext';
import { webRTCService } from '@/lib/services/webrtc.service';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    participant?: {
        _id: string;
        name: string;
        avatar?: string;
    };
    isIncoming?: boolean;
    isVideoCall?: boolean; // true = video call, false = audio call
}

export interface VideoCallState {
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
    isConnected: boolean;
    isConnecting: boolean;
    callDuration: number;
}

const VideoCallModal: React.FC<Props> = ({
    isOpen,
    onClose,
    participant,
    isIncoming = false,
    isVideoCall = true,
}) => {
    const {
        currentCall,
        callState,
        acceptCall,
        rejectCall,
        endCall,
        getLocalStream,
        getRemoteStream,
    } = useVideoCall();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const videoSetRef = useRef<boolean>(false); // Flag để tránh re-set video
    const isTogglingVideo = useRef<boolean>(false); // Flag để prevent concurrent video toggles

    // Function để set video stream
    const setVideoStream = (element: HTMLVideoElement, stream: MediaStream) => {
        if (videoSetRef.current && element.srcObject === stream) {
            console.log('Video stream already set correctly');
            return; // Đã set rồi, không set lại
        }

        console.log('Setting video stream to element');

        // Ensure clean state
        element.pause();
        element.srcObject = stream;
        videoSetRef.current = true;

        element.onloadedmetadata = () => {
            console.log('Video metadata loaded, starting playback');
            element.play().catch(console.error);
        };
    };

    // Debug function to check stream state
    const debugStreamState = useCallback(() => {
        const localStream = getLocalStream();
        if (localStream) {
            const videoTracks = localStream.getVideoTracks();
            console.log('=== Stream Debug ===');
            console.log('Video tracks count:', videoTracks.length);
            console.log(
                'Video tracks:',
                videoTracks.map((track: MediaStreamTrack) => ({
                    id: track.id,
                    enabled: track.enabled,
                    readyState: track.readyState,
                }))
            );
            console.log(
                'Video element srcObject:',
                localVideoRef.current?.srcObject
            );
            console.log('videoSetRef.current:', videoSetRef.current);
            console.log('==================');
        }
    }, [getLocalStream]);

    const [localCallState, setLocalCallState] = useState<VideoCallState>({
        isVideoEnabled: isVideoCall, // Chỉ enable video nếu là video call
        isAudioEnabled: true,
        isConnected: false,
        isConnecting: false,
        callDuration: 0,
    });

    const [showControls, setShowControls] = useState(true);
    const [isLoadingMedia, setIsLoadingMedia] = useState(true);
    const [isTogglingVideoState, setIsTogglingVideoState] = useState(false);
    const [remoteVideoAvailable, setRemoteVideoAvailable] = useState(false);
    const [remoteAudioAvailable, setRemoteAudioAvailable] = useState(true);

    // Check if we should show video or avatar
    const shouldShowVideo = useCallback(() => {
        console.log('shouldShowVideo called:', remoteVideoAvailable);
        return remoteVideoAvailable;
    }, [remoteVideoAvailable]);

    // Auto-enable camera for incoming video calls
    useEffect(() => {
        if (!isOpen || !isIncoming || !isVideoCall) return;

        const enableCameraForIncomingVideoCall = async () => {
            try {
                console.log('Auto-enabling camera for incoming video call...');
                setIsLoadingMedia(true);

                // Get camera and microphone for incoming video call
                const stream = await webRTCService.getUserMedia({
                    video: true,
                    audio: true,
                });

                console.log('Got camera for incoming video call:', stream);
                setIsLoadingMedia(false);

                // Update UI state to show video is enabled
                setLocalCallState((prev) => ({
                    ...prev,
                    isVideoEnabled: true,
                }));
            } catch (error) {
                console.error(
                    'Error enabling camera for incoming video call:',
                    error
                );
                setIsLoadingMedia(false);
                // Keep video disabled if camera access fails
                setLocalCallState((prev) => ({
                    ...prev,
                    isVideoEnabled: false,
                }));
            }
        };

        enableCameraForIncomingVideoCall();
    }, [isOpen, isIncoming, isVideoCall]);

    // Initialize camera when modal opens
    // Set up video streams when available
    useEffect(() => {
        if (!isOpen) return;

        console.log('Setting up video streams...');
        const localStream = getLocalStream();
        const remoteStream = getRemoteStream();

        console.log(
            'Available streams - Local:',
            !!localStream,
            'Remote:',
            !!remoteStream
        );

        // Don't override global loading state, just log for debugging
        console.log(
            'Streams check - Local:',
            !!localStream,
            'Remote:',
            !!remoteStream,
            'Global loading:',
            callState.isLoadingMedia
        );

        // Set local video
        if (localVideoRef.current && localStream) {
            console.log('Setting local stream to video element');
            setVideoStream(localVideoRef.current, localStream);
        }

        // Set remote video
        if (remoteVideoRef.current && remoteStream) {
            console.log('Setting remote stream to video element');
            setVideoStream(remoteVideoRef.current, remoteStream);
        }
    }, [isOpen, getLocalStream, getRemoteStream, callState.isLoadingMedia]);

    // Update remote video when remote stream gets video tracks
    useEffect(() => {
        const remoteStream = getRemoteStream();
        if (remoteVideoRef.current && remoteStream && shouldShowVideo()) {
            console.log('Force updating remote video due to new video tracks');
            // Reset video flag to force re-set when stream changes
            videoSetRef.current = false;
            setVideoStream(remoteVideoRef.current, remoteStream);
        }
    }, [shouldShowVideo, getRemoteStream]);

    // Track remote video availability
    useEffect(() => {
        const remoteStream = getRemoteStream();
        if (!remoteStream) {
            setRemoteVideoAvailable(false);
            return;
        }

        const checkVideoAvailability = () => {
            const videoTracks = remoteStream.getVideoTracks();
            const hasActiveVideo =
                videoTracks.length > 0 &&
                videoTracks.some((track) => track.enabled);

            console.log('Checking remote video availability:', {
                tracksCount: videoTracks.length,
                tracksEnabled: videoTracks.map((track) => track.enabled),
                hasActiveVideo,
            });

            setRemoteVideoAvailable(hasActiveVideo);
        };

        // Initial check
        checkVideoAvailability();

        // Poll every 200ms for more responsive UI
        const interval = setInterval(checkVideoAvailability, 200);

        return () => clearInterval(interval);
    }, [getRemoteStream]);

    // Track remote audio availability
    useEffect(() => {
        const remoteStream = getRemoteStream();
        if (!remoteStream) {
            setRemoteAudioAvailable(true); // Default to true when no stream
            return;
        }

        const checkAudioAvailability = () => {
            const audioTracks = remoteStream.getAudioTracks();
            const hasActiveAudio =
                audioTracks.length > 0 &&
                audioTracks.some((track) => track.enabled);

            console.log('Checking remote audio availability:', {
                tracksCount: audioTracks.length,
                tracksEnabled: audioTracks.map((track) => track.enabled),
                hasActiveAudio,
            });

            setRemoteAudioAvailable(hasActiveAudio);
        };

        // Initial check
        checkAudioAvailability();

        // Poll every 200ms for responsive UI
        const interval = setInterval(checkAudioAvailability, 200);

        return () => clearInterval(interval);
    }, [getRemoteStream]);

    // Sync global call state to local state
    useEffect(() => {
        console.log('Syncing global call state to local:', callState);
        setLocalCallState((prev) => {
            // Reset call duration when connection is first established
            const shouldResetDuration =
                !prev.isConnected && callState.isConnected;

            return {
                ...prev,
                isConnected: callState.isConnected,
                isConnecting: callState.isConnecting,
                callDuration: shouldResetDuration ? 0 : prev.callDuration,
            };
        });

        // Use global loading media state
        setIsLoadingMedia(callState.isLoadingMedia);
    }, [callState]);

    useEffect(() => {
        if (!isOpen) return;

        // Auto hide controls after 3 seconds
        const timer = setTimeout(() => {
            setShowControls(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [isOpen, showControls]);

    useEffect(() => {
        // Only start timer when call is actually connected (not just when call is initiated)
        if (
            !isOpen ||
            !localCallState.isConnected ||
            localCallState.isConnecting
        )
            return;

        // Call duration timer - starts only after connection is established
        const timer = setInterval(() => {
            setLocalCallState((prev) => ({
                ...prev,
                callDuration: prev.callDuration + 1,
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, localCallState.isConnected, localCallState.isConnecting]);

    // Reset video set flag khi modal đóng
    useEffect(() => {
        if (!isOpen) {
            videoSetRef.current = false;
            isTogglingVideo.current = false;
            setIsTogglingVideoState(false);

            // Reset call state when modal closes
            setLocalCallState({
                isVideoEnabled: isVideoCall,
                isAudioEnabled: true,
                isConnected: false,
                isConnecting: false,
                callDuration: 0,
            });

            // Reset remote video availability
            setRemoteVideoAvailable(false);

            // Reset remote audio availability
            setRemoteAudioAvailable(true);

            // Clear video element references to prevent continued camera access
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
            }
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
        }
    }, [isOpen, isVideoCall]);

    // Set video stream khi element và stream đều sẵn sàng
    useEffect(() => {
        const localStream = getLocalStream();
        if (
            localVideoRef.current &&
            localStream &&
            localCallState.isVideoEnabled &&
            !isLoadingMedia
        ) {
            console.log('useEffect: Setting video stream');
            debugStreamState();
            setVideoStream(localVideoRef.current, localStream);
        }
    }, [
        localCallState.isVideoEnabled,
        isLoadingMedia,
        getLocalStream,
        debugStreamState,
    ]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAcceptCall = () => {
        acceptCall();
    };

    const handleRejectCall = () => {
        rejectCall();
    };

    const handleEndCall = () => {
        endCall();
    };

    const toggleVideo = async () => {
        // Prevent concurrent toggles
        if (isTogglingVideo.current) {
            console.log('Video toggle already in progress, ignoring...');
            return;
        }

        isTogglingVideo.current = true;
        setIsTogglingVideoState(true);

        console.log('=== Before Toggle ===');
        debugStreamState();

        try {
            const newVideoState = !localCallState.isVideoEnabled;
            console.log(`Toggling video: ${newVideoState ? 'ON' : 'OFF'}`);

            if (
                newVideoState &&
                !webRTCService.getLocalStream()?.getVideoTracks().length
            ) {
                // Need to add video track
                await webRTCService.addVideoTrack();
            } else {
                // Just toggle existing track
                webRTCService.toggleVideo(newVideoState);
            }

            setLocalCallState((prev) => ({
                ...prev,
                isVideoEnabled: newVideoState,
            }));

            console.log(`Video ${newVideoState ? 'enabled' : 'disabled'}`);
            debugStreamState();
        } catch (error) {
            console.error('Error toggling video:', error);
            // Reset state nếu có lỗi
            setLocalCallState((prev) => ({
                ...prev,
                isVideoEnabled: false,
            }));
        } finally {
            // Always reset the toggle flag after a delay
            setTimeout(() => {
                isTogglingVideo.current = false;
                setIsTogglingVideoState(false);
            }, 500);
        }
    };

    const toggleAudio = () => {
        const newAudioState = !localCallState.isAudioEnabled;
        webRTCService.toggleAudio(newAudioState);

        setLocalCallState((prev) => ({
            ...prev,
            isAudioEnabled: newAudioState,
        }));

        console.log(`Audio ${newAudioState ? 'enabled' : 'disabled'}`);
    };

    const handleMouseMove = () => {
        setShowControls(true);
    };

    const handleVideoCanPlay = () => {
        console.log('Video can play - stream is ready');
        // Video sẽ tự play do autoPlay attribute
    };

    const handleVideoLoadedMetadata = () => {
        console.log('Video metadata loaded');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black">
            <div
                className="relative h-full w-full"
                onMouseMove={handleMouseMove}
            >
                {/* Remote video (main view) */}
                <div className="absolute inset-0">
                    {(() => {
                        const showVideo =
                            localCallState.isConnected && shouldShowVideo();
                        console.log('Render decision:', {
                            isConnected: localCallState.isConnected,
                            shouldShowVideo: shouldShowVideo(),
                            showVideo,
                        });
                        return showVideo;
                    })() ? (
                        <video
                            ref={remoteVideoRef}
                            className="h-full w-full object-cover"
                            autoPlay
                            playsInline
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-2 to-primary-1">
                            <div className="text-center text-white">
                                <Avatar
                                    imgSrc={participant?.avatar}
                                    alt={participant?.name || 'User'}
                                    width={120}
                                    height={120}
                                    className="mx-auto mb-4"
                                />
                                <h2 className="mb-2 text-2xl font-semibold">
                                    {participant?.name || 'Unknown User'}
                                </h2>
                                <p className="text-lg opacity-80">
                                    {localCallState.isConnecting
                                        ? 'Đang kết nối...'
                                        : localCallState.isConnected
                                          ? formatDuration(
                                                localCallState.callDuration
                                            )
                                          : isIncoming
                                            ? isVideoCall
                                                ? 'Cuộc gọi video đến'
                                                : 'Cuộc gọi thoại đến'
                                            : isVideoCall
                                              ? 'Đang gọi video...'
                                              : 'Đang gọi...'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Remote user mute indicator */}
                    {(() => {
                        const showMuteIcon =
                            localCallState.isConnected && !remoteAudioAvailable;
                        console.log('Mute indicator:', {
                            isConnected: localCallState.isConnected,
                            remoteAudioAvailable,
                            showMuteIcon,
                        });
                        return showMuteIcon;
                    })() && (
                        <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-red-500 shadow-lg">
                            <Icons.MicOff size={20} className="text-white" />
                        </div>
                    )}
                </div>

                {/* Local video (small view) - hiển thị khi có video hoặc đang loading */}
                {(localCallState.isVideoEnabled || isLoadingMedia) && (
                    <div className="absolute right-4 top-4 h-56 w-40 overflow-hidden rounded-lg bg-gray-800 shadow-lg">
                        {isLoadingMedia ? (
                            <div className="flex h-full w-full items-center justify-center bg-gray-700 text-white">
                                <Icons.Loading size={20} />
                            </div>
                        ) : localCallState.isVideoEnabled ? (
                            <video
                                ref={localVideoRef}
                                className="h-full w-full object-cover"
                                autoPlay
                                playsInline
                                muted
                                controls={false}
                                style={{ transform: 'scaleX(-1)' }} // Mirror effect
                                onCanPlay={handleVideoCanPlay}
                                onLoadedMetadata={handleVideoLoadedMetadata}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-700 text-white">
                                <Icons.CameraOff size={24} />
                            </div>
                        )}
                    </div>
                )}

                {/* Top bar with call info - only show when there's remote video */}
                {showControls &&
                    localCallState.isConnected &&
                    shouldShowVideo() && (
                        <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/50 to-transparent p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-white">
                                    <Avatar
                                        imgSrc={participant?.avatar}
                                        alt={participant?.name || 'User'}
                                        width={32}
                                        height={32}
                                        className="mr-3"
                                    />
                                    <div>
                                        <p className="font-medium">
                                            {participant?.name}
                                        </p>
                                        <p className="text-sm opacity-80">
                                            {formatDuration(
                                                localCallState.callDuration
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Bottom controls */}
                <div
                    className={cn(
                        'absolute bottom-0 left-0 right-0 transition-all duration-300',
                        showControls ? 'translate-y-0' : 'translate-y-full'
                    )}
                >
                    <div className="bg-gradient-to-t from-black/70 to-transparent p-6">
                        <div className="flex justify-center space-x-6">
                            {/* Incoming call buttons */}
                            {isIncoming &&
                                !localCallState.isConnected &&
                                !localCallState.isConnecting && (
                                    <>
                                        <Button
                                            className="h-16 w-16 rounded-full bg-red-500 text-white hover:bg-red-600"
                                            onClick={handleRejectCall}
                                            title="Từ chối cuộc gọi"
                                        >
                                            <Icons.PhoneEnd size={24} />
                                        </Button>
                                        <Button
                                            className="h-16 w-16 rounded-full bg-green-500 text-white hover:bg-green-600"
                                            onClick={handleAcceptCall}
                                            title="Chấp nhận cuộc gọi"
                                        >
                                            <Icons.Phone size={24} />
                                        </Button>
                                    </>
                                )}

                            {/* Connected call controls */}
                            {(localCallState.isConnected ||
                                (!isIncoming &&
                                    !localCallState.isConnecting)) && (
                                <>
                                    {/* Audio toggle */}
                                    <Button
                                        className={cn(
                                            'h-12 w-12 rounded-full text-white',
                                            localCallState.isAudioEnabled
                                                ? 'bg-gray-600 hover:bg-gray-700'
                                                : 'bg-red-500 hover:bg-red-600'
                                        )}
                                        onClick={toggleAudio}
                                        title={
                                            localCallState.isAudioEnabled
                                                ? 'Tắt micro'
                                                : 'Bật micro'
                                        }
                                    >
                                        {localCallState.isAudioEnabled ? (
                                            <Icons.Mic size={20} />
                                        ) : (
                                            <Icons.MicOff size={20} />
                                        )}
                                    </Button>

                                    {/* Video toggle - luôn hiển thị để có thể bật camera trong cuộc gọi */}
                                    <Button
                                        className={cn(
                                            'h-12 w-12 rounded-full text-white',
                                            localCallState.isVideoEnabled
                                                ? 'bg-gray-600 hover:bg-gray-700'
                                                : 'bg-red-500 hover:bg-red-600',
                                            isTogglingVideoState &&
                                                'cursor-not-allowed opacity-70'
                                        )}
                                        onClick={toggleVideo}
                                        disabled={isTogglingVideoState}
                                        title={
                                            isTogglingVideoState
                                                ? 'Đang xử lý...'
                                                : localCallState.isVideoEnabled
                                                  ? 'Tắt camera'
                                                  : 'Bật camera'
                                        }
                                    >
                                        {isTogglingVideoState ? (
                                            <Icons.Loading size={20} />
                                        ) : localCallState.isVideoEnabled ? (
                                            <Icons.VideoCall size={20} />
                                        ) : (
                                            <Icons.VideoCallOff size={20} />
                                        )}
                                    </Button>

                                    {/* End call */}
                                    <Button
                                        className="h-12 w-12 rounded-full bg-red-500 text-white hover:bg-red-600"
                                        onClick={handleEndCall}
                                        title="Kết thúc cuộc gọi"
                                    >
                                        <Icons.PhoneEnd size={20} />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loading media state */}
                {isLoadingMedia && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                            <Icons.Loading size={48} className="mx-auto mb-4" />
                            <p className="text-lg">
                                {isVideoCall
                                    ? 'Đang truy cập camera và microphone...'
                                    : 'Đang truy cập microphone...'}
                            </p>
                            <p className="mt-2 text-sm opacity-70">
                                {isVideoCall
                                    ? 'Vui lòng cho phép truy cập để bắt đầu video call'
                                    : 'Vui lòng cho phép truy cập để bắt đầu cuộc gọi'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Connecting state */}
                {localCallState.isConnecting && !isLoadingMedia && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                            <Icons.Loading size={48} className="mx-auto mb-4" />
                            <p className="text-lg">Đang kết nối...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoCallModal;
