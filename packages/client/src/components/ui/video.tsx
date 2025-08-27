import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface IVideoProps extends React.HTMLAttributes<HTMLVideoElement> {
    src?: string;
    onVideoDrop?: (files: FileList) => void; // Callback khi có file được thả vào
    acceptDrop?: boolean; // Bật/tắt tính năng kéo thả
}

const Video = React.forwardRef<HTMLVideoElement, IVideoProps>(
    ({ src, className, onVideoDrop, acceptDrop = false, ...props }, ref) => {
        const [isDragging, setIsDragging] = useState(false);

        // Xử lý sự kiện kéo thả
        const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (acceptDrop) setIsDragging(true);
        };

        const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (acceptDrop) setIsDragging(false);
        };

        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            if (acceptDrop) {
                setIsDragging(false);

                // Kiểm tra có file và callback không
                if (
                    e.dataTransfer.files &&
                    e.dataTransfer.files.length > 0 &&
                    onVideoDrop
                ) {
                    // Lọc chỉ các file video
                    const videoFiles = Array.from(
                        e.dataTransfer.files || []
                    ).filter((file) => file.type.startsWith('video/'));

                    if (videoFiles.length > 0) {
                        // Tạo FileList tương đương từ mảng video files
                        const dataTransfer = new DataTransfer();
                        videoFiles.forEach((file) =>
                            dataTransfer.items.add(file)
                        );
                        onVideoDrop(dataTransfer.files);
                    }
                }
            }
        };

        return (
            <div
                className={cn(
                    'relative',
                    isDragging &&
                        'ring-2 ring-primary-1 before:absolute before:inset-0 before:bg-black/20'
                )}
                onDragEnter={acceptDrop ? handleDragEnter : undefined}
                onDragLeave={acceptDrop ? handleDragLeave : undefined}
                onDragOver={acceptDrop ? handleDragOver : undefined}
                onDrop={acceptDrop ? handleDrop : undefined}
            >
                <video
                    ref={ref}
                    className={cn('h-full w-full object-cover', className)}
                    src={src}
                    controls
                    {...props}
                >
                    Your browser does not support the video tag.
                </video>

                {acceptDrop && isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                        <p>Thả video ở đây</p>
                    </div>
                )}
            </div>
        );
    }
);

Video.displayName = 'Video';

export default Video;
