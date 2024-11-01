import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    children: React.ReactNode;
    width?: number;
    direction?: 'left' | 'right';
}

const FixedSidebar: React.FC<Props> = ({
    className,
    width = 300,
    direction = 'left',
    children,
}) => {
    return (
        <aside
            className={cn(
                'no-scrollbar fixed top-[56px] h-full overflow-scroll border-r-2 bg-white p-2 pr-2 dark:border-none dark:bg-dark-secondary-1',
                className,
                direction == 'left' && 'left-0',
                direction == 'right' && 'right-0',
                width && `w-${width}`
            )}
        >
            {children}
        </aside>
    );
};

export default FixedSidebar;
