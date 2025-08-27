import NextImage from 'next/image';
import React, { useState } from 'react';

interface IImageProps extends React.ComponentProps<typeof NextImage> {}

export const ErrorImage = () => {
    return (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-secondary-1 dark:bg-dark-secondary-2">
            <p className="select-none text-center text-gray-500">
                Ảnh hiện không khả dụng
            </p>
        </div>
    );
};

const Image = ({ src, ...props }: IImageProps) => {
    const [imgError, setImgError] = useState(false);

    return (
        <>
            {imgError ? (
                <ErrorImage />
            ) : (
                <NextImage
                    className="rounded-md object-cover"
                    quality={100}
                    src={imgError ? '/assets/img/placeholder-image.png' : src}
                    {...props}
                    alt={props.alt || 'Image'}
                    onError={() => setImgError(true)}
                />
            )}
        </>
    );
};

export default Image;
