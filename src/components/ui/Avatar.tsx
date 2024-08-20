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
}) => {
    const isUser = session?.user.id || userUrl;
    const sizeProps = fill
        ? { fill: true }
        : {
              width: width,
              height: height,
          };

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
export default Avatar;
