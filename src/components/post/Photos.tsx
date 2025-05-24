import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { Icons } from '../ui';

interface MediaItem {
    url: string;
    type: 'image' | 'video';
    file?: File;
}

interface Props {
    className?: string;
    photos: MediaItem[];
    onClickPhoto: (index: number) => void;
}

const Photos: React.FC<Props> = ({ className = '', photos, onClickPhoto }) => {
    return (
        <>
            {/* Kiểm tra  */}
            {photos && photos.length > 0 && (
                <div
                    className={cn(
                        'flex max-h-[200px] flex-wrap overflow-y-scroll rounded-xl p-2',
                        className
                    )}
                >
                    {photos.map((img, index: number) => {
                        return (
                            <div
                                className="relative w-[50%] overflow-hidden px-1"
                                key={index}
                            >
                                <span
                                    className="absolute left-2 top-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                                    onClick={() => onClickPhoto(index)}
                                >
                                    <Icons.Close className="h-5 w-5" />
                                </span>
                                {img.type === 'video' ? (
                                    <video
                                        className="mt-2 h-full w-full rounded-xl object-cover"
                                        controls
                                    >
                                        <source
                                            src={img.url}
                                            type="video/mp4"
                                        />
                                    </video>
                                ) : (
                                    <div className="relative min-h-[500px] w-full object-cover">
                                        <Image
                                            className="mt-2 align-middle "
                                            quality={100}
                                            src={img.url || ''}
                                            alt=""
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* {photos && photos.length > 0 && (
                <div
                    className={cn(
                        'flex max-h-[200px] flex-wrap overflow-y-scroll rounded-xl p-2',
                        className
                    )}
                >
                    {photos.map((img: string, index: number) => {
                        return (
                            <div
                                className="relative w-[50%] overflow-hidden px-1"
                                key={index}
                            >
                                <span
                                    className="absolute left-2 top-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                                    onClick={() => onClickPhoto(index)}
                                >
                                    <Icons.Close className="h-5 w-5" />
                                </span>
                                <div className="relative min-h-[500px] w-full object-cover">
                                    <Image
                                        className="mt-2 align-middle "
                                        quality={100}
                                        src={img || ''}
                                        alt=""
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )} */}
        </>
    );
};

export default Photos;
