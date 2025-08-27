import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    children: React.ReactNode;
    width?: number;
    direction?: 'left' | 'right';
    hideOnMobile?: boolean;
}

const FixedSidebar: React.FC<Props> = ({
    className,
    width = 300,
    direction = 'left',
    hideOnMobile = true,
    children,
}) => {
    return (
        <aside
            className={cn(
                'no-scrollbar fixed top-[56px] h-full min-w-[280px] max-w-[360px] overflow-scroll border-r-2 bg-white p-2 pr-2 dark:border-none dark:bg-dark-secondary-1 xl:min-w-0',
                className,
                direction == 'left' && 'left-0',
                direction == 'right' && 'right-0',
                hideOnMobile && 'md:hidden'
            )}
        >
            <div>{children}</div>
        </aside>
    );
};

export default FixedSidebar;
