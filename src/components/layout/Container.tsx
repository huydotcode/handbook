import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    children: React.ReactNode;
    direction?: 'left' | 'center' | 'right';
    width?: number;
}

const Container: React.FC<Props> = ({
    className,
    children,
    direction = 'center',
    width,
}) => {
    return (
        <div
            className={cn(
                'mt-[56px] h-screen w-[--container-width] max-w-screen pr-2',
                direction === 'right' && 'ml-[320px] md:ml-0',
                direction === 'center' && 'mx-auto',
                width && `w-[${width}px]`,
                className
            )}
        >
            {children}
        </div>
    );
};

export default Container;
