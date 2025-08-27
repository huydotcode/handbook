import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVideoVolume } from '@/hooks/useVideoVolume';

interface VideoPlayerProps {
    src: string;
    videoClassName?: string;
    containerClassName?: string;
}

const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    src,
    videoClassName = '',
    containerClassName = '',
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const [volume, setVolume] = useVideoVolume();
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const [videoError, setVideoError] = useState<boolean>(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => setCurrentTime(video.currentTime);
        const updateDuration = () => setDuration(video.duration);

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleVolume = () => {
        const video = videoRef.current;
        if (!video) return;

        const newVolume = video.muted ? 1 : 0;
        video.muted = !video.muted;
        setVolume(newVolume);
    };

    const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        const progress = progressRef.current;
        if (!video || !progress) return;

        const rect = progress.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * video.duration;
        video.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleFullScreen = () => {
        const videoContainer = videoRef.current?.parentElement;
        if (!videoContainer) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoContainer.requestFullscreen();
        }
    };

    const handleError = () => {
        setVideoError(true);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.volume = volume;
            video.muted = volume === 0;
        }
    }, [volume]);

    useEffect(() => {
        const savedVolume = localStorage.getItem('videoVolume');
        const video = videoRef.current;
        if (video && savedVolume !== null) {
            const parsedVolume = parseFloat(savedVolume);
            video.volume = parsedVolume;
            video.muted = parsedVolume === 0;
            setVolume(parsedVolume);
        }
    }, [setVolume]);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const updateVolume = () => {
            if (video) {
                setVolume(video.volume);
            }
        };

        video?.addEventListener('volumechange', updateVolume);

        return () => {
            if (video) {
                video.removeEventListener('volumechange', updateVolume);
            }
        };
    }, [setVolume, videoRef]);

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullScreenChange
            );
        };
    }, []);

    return (
        <div
            className={cn(
                'relative w-full overflow-hidden rounded-xl bg-black shadow-2xl',
                containerClassName,
                {
                    'h-screen': isFullScreen,
                    'max-h-[80vh]': !isFullScreen,
                }
            )}
        >
            <div className="relative max-h-full w-full">
                <video
                    ref={videoRef}
                    src={src}
                    className={cn(
                        'h-full max-h-screen w-full object-contain',
                        videoClassName,
                        {
                            'h-screen': isFullScreen,
                            'max-h-[80vh]': !isFullScreen,
                        }
                    )}
                    onClick={togglePlay}
                    onError={handleError}
                />
                {videoError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                        <p className="select-none text-center">
                            Video không khả dụng
                        </p>
                    </div>
                ) : (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 text-white">
                        {/* Progress Bar */}
                        <div
                            ref={progressRef}
                            className="mb-2 h-2 w-full cursor-pointer rounded bg-gray-600"
                            onClick={handleProgressClick}
                        >
                            <div
                                className="h-2 rounded bg-primary-1"
                                style={{
                                    width: `${(currentTime / duration) * 100 || 0}%`,
                                }}
                            ></div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="group flex items-center gap-3">
                                <button onClick={togglePlay}>
                                    {isPlaying ? (
                                        <Pause size={22} />
                                    ) : (
                                        <Play size={22} />
                                    )}
                                </button>
                                <div className="flex items-center gap-2">
                                    <button onClick={handleVolume}>
                                        {volume === 0 ? (
                                            <VolumeX size={22} />
                                        ) : (
                                            <Volume2 size={22} />
                                        )}
                                    </button>
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={volume}
                                        onChange={(e) => {
                                            const newVolume = parseFloat(
                                                e.target.value
                                            );
                                            const video = videoRef.current;
                                            if (video) {
                                                video.volume = newVolume;
                                                video.muted = newVolume === 0;
                                            }
                                            setVolume(newVolume);
                                        }}
                                        className="h-1 w-0 cursor-pointer accent-primary-1 opacity-0 transition-all duration-200 ease-in-out group-hover:h-1 group-hover:w-20 group-hover:opacity-100"
                                    />
                                </div>
                                <span>
                                    {formatTime(currentTime)} /{' '}
                                    {formatTime(duration)}
                                </span>
                            </div>
                            <button onClick={handleFullScreen}>
                                <Maximize2 size={22} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
