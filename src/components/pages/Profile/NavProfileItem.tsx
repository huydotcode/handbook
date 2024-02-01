'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Props {
    userId: string;
    path: string;
    name: string;
}

const NavProfileItem: React.FC<Props> = ({ userId, name, path }) => {
    const pathName = usePathname();
    const isActived = pathName === `/profile/${userId}${path}`;

    return (
        <Link
            href={`/profile/${userId}/${path}`}
            className={cn(
                'relative flex h-10 items-center justify-center rounded-md px-3 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                isActived && 'text-blue-500 dark:text-blue-500'
            )}
        >
            <span className="text-sm font-semibold ">{name}</span>
            {isActived && (
                <div className="absolute bottom-0 h-1 w-full bg-primary"></div>
            )}
        </Link>
    );
};
export default NavProfileItem;
