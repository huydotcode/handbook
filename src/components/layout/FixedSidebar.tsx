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
    hideOnMobile = false,
    children,
}) => {
    return (
        <aside
            className={cn(
                'no-scrollbar fixed top-[56px] h-full overflow-scroll border-r-2 bg-white p-2 dark:border-none dark:bg-dark-secondary-1',
                className,
                direction == 'left' && 'left-0',
                direction == 'right' && 'right-0',
                hideOnMobile && 'md:hidden'
            )}
        >
            <div className={cn('', width && `w-[${width}px] xl:w-fit`)}>
                {children}
            </div>
        </aside>
    );
};

export default FixedSidebar;
