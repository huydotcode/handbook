import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface VideoPlayerProps {
    src: string;
}

const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
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

    return (
        <div className="w-full overflow-hidden rounded-xl bg-black shadow-2xl">
            <div className="relative">
                <video
                    ref={videoRef}
                    src={src}
                    className="h-auto w-full"
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
                            <div className="flex items-center gap-3">
                                <button onClick={togglePlay}>
                                    {isPlaying ? (
                                        <Pause size={22} />
                                    ) : (
                                        <Play size={22} />
                                    )}
                                </button>
                                <button onClick={handleVolume}>
                                    {volume === 0 ? (
                                        <VolumeX size={22} />
                                    ) : (
                                        <Volume2 size={22} />
                                    )}
                                </button>
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
