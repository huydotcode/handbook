'use client';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

interface Props {
    id: string;
    path: string;
    name: string;
    page: 'profile' | 'groups';
}

const TabItem: React.FC<Props> = ({ name, path, id, page }) => {
    const pathName = usePathname();
    const pathPage = `/${page}/${id}${path}`;
    const isActived = pathPage == pathName;

    return (
        <Button
            href={`/profile/${id}/${path}`}
            className={cn(
                'relative flex h-10 items-center justify-center rounded-md px-3 shadow-none',
                isActived && 'text-primary-2 dark:text-primary-2'
            )}
        >
            <span className="text-sm font-semibold ">{name}</span>
            {isActived && (
                <div className="absolute bottom-0 h-1 w-full bg-primary-2"></div>
            )}
        </Button>
    );
};
export default TabItem;
