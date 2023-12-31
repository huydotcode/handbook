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
}) => {
    const isUser = session?.user.id || userUrl;

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
                className="rounded-full"
                src={session?.user.image || imgSrc || ''}
                alt={session?.user.name || alt || ''}
                width={width}
                height={height}
                fill={fill}
                priority={true}
            />
        </Link>
    );
};
export default Avatar;
