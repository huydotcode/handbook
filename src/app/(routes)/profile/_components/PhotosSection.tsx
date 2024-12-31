'use client';
import { SlideShow } from '@/components/ui';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { removeImage } from '@/lib/actions/image.action';

interface Props {
    photos: string[];
}

const PhotosSection: React.FC<Props> = ({ photos }) => {
    const pathName = usePathname();
    const isPhotosPage = pathName.includes('photos');

    const [showSlide, setShowSlide] = useState<boolean>(false);
    const [indexPicture, setIndexPicture] = useState<number>(0);

    return (
        <section className="relative my-3 rounded-xl  bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
            <h5 className="text-xl font-bold">Ảnh</h5>
            <article>
                <div
                    className={cn(
                        'mt-2 grid grid-cols-3 gap-2 lg:grid-cols-2',
                        {
                            'grid-cols-2 md:grid-cols-1': isPhotosPage,
                        }
                    )}
                >
                    {photos
                        .slice(0, 5)
                        .map((picture: string, index: number) => {
                            return (
                                <div
                                    className={cn(
                                        'relative w-full rounded-md shadow-md hover:cursor-pointer',
                                        {
                                            'min-h-[400px]': isPhotosPage,
                                            'min-h-[200px]': !isPhotosPage,
                                        }
                                    )}
                                    key={index}
                                    onClick={() => {
                                        setShowSlide(true);
                                        setIndexPicture(index);
                                    }}
                                >
                                    <Image
                                        onError={async (e) => {
                                            await removeImage({
                                                imageUrl: picture,
                                            });
                                        }}
                                        className="rounded-md object-contain"
                                        src={picture}
                                        alt={picture}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 768px"
                                    />
                                </div>
                            );
                        })}
                </div>

                {photos.length === 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                        Không có ảnh nào
                    </p>
                )}
            </article>

            <SlideShow
                images={photos}
                show={showSlide}
                setShow={setShowSlide}
                startIndex={indexPicture}
            />
        </section>
    );
};
export default PhotosSection;
