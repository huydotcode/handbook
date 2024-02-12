'use client';
import { Button } from '@/components/ui';
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
        <Button
            href={`/profile/${userId}/${path}`}
            className={cn(
                'relative flex h-10 items-center justify-center rounded-md px-3 shadow-none',
                isActived && 'text-primary-2'
            )}
        >
            <span className="text-sm font-semibold ">{name}</span>
            {isActived && (
                <div className="absolute bottom-0 h-1 w-full bg-primary-2"></div>
            )}
        </Button>
    );
};
export default NavProfileItem;
