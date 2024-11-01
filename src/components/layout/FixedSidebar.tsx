import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    children: React.ReactNode;
    direction?: 'left' | 'right';
}

const FixedSidebar: React.FC<Props> = ({
    className,
    direction = 'left',
    children,
}) => {
    return (
        <aside
            className={cn(
                'no-scrollbar fixed top-[56px] h-full w-[300px] overflow-scroll border-r-2 bg-white p-2 pr-2 dark:border-none lg:w-fit md:hidden',
                className,
                direction == 'left' && 'left-0',
                direction == 'right' && 'right-0'
            )}
        >
            {children}
        </aside>
    );
};

export default FixedSidebar;
