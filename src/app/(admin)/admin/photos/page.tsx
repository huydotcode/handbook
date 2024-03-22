import { fetchAllPhotos } from '@/lib/actions/admin/image.action';
import Image from 'next/image';
import React from 'react';

interface Props {}

const page: React.FC<Props> = async ({}) => {
    const photos = (await fetchAllPhotos()) as IImage[];

    return (
        <>
            <div className="grid min-h-screen w-full grid-cols-3 gap-4 p-2 lg:grid-cols-2 md:grid-cols-1">
                {photos.map((image) => {
                    return (
                        <div
                            className="relative min-h-[400px]"
                            key={image.asset_id}
                        >
                            <Image
                                className="h-full w-full rounded-lg object-cover"
                                alt={image.user_id}
                                src={image.url}
                                fill
                                quality={100}
                            />
                        </div>
                    );
                })}

                {photos.length === 0 && (
                    <div className="col-span-3 text-center text-xl font-semibold text-secondary-1 dark:text-dark-primary-1">
                        Không có ảnh nào
                    </div>
                )}
            </div>
        </>
    );
};
export default page;
