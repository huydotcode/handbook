'use client';
import { cn } from '@/lib/utils';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
    className?: string;
    session?: Session;
    userUrl?: string;
    imgSrc?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    alt?: string;
    href?: string;
    rounded?: string;
    onlyImage?: boolean;
}

const Avatar: React.FC<Props> = ({
    className,
    session,
    imgSrc,
    userUrl,
    alt,
    width = 32,
    height = 32,
    fill = false,
    href,
    rounded = 'full',
    onlyImage = false,
}) => {
    const isUser = session?.user.id || userUrl;
    const sizeProps = fill
        ? { fill: true }
        : {
              width: width,
              height: height,
          };

    if (onlyImage) {
        return (
            <Image
                className={cn(`rounded-${rounded}`, className)}
                src={session?.user.image || imgSrc || ''}
                alt={session?.user.name || alt || ''}
                priority={true}
                {...sizeProps}
            />
        );
    }

    return (
        <Link
            className={className}
            href={
                (isUser && `/profile/${session?.user.id || userUrl}`) ||
                (href && href) ||
                ''
            }
        >
            <Image
                className={cn(`rounded-${rounded}`, className)}
                src={session?.user.image || imgSrc || ''}
                alt={session?.user.name || alt || ''}
                priority={true}
                {...sizeProps}
            />
        </Link>
    );
};

export const SkeletonAvatar: React.FC<Props> = ({
    className,
    width = 40,
    height = 40,
    rounded = 'full',
}) => {
    return (
        <div
            className={cn(
                'animate-pulse bg-gray-300 dark:bg-gray-600',
                `rounded-${rounded}`,
                className
            )}
            style={{ width: width, height: height }}
        ></div>
    );
};

export default Avatar;
