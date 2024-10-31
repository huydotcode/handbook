import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    children: React.ReactNode;
}

const FixedSidebar: React.FC<Props> = ({ className, children }) => {
    return (
        <aside
            className={cn(
                'no-scrollbar fixed left-0 top-[56px] h-full w-[300px] overflow-scroll border-r-2 p-2 pr-2 dark:border-none lg:w-fit md:hidden',
                className
            )}
        >
            {children}
        </aside>
    );
};

export default FixedSidebar;
