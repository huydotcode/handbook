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
                'mt-[56px] flex h-screen max-w-[100%-320px]',
                direction === 'right' ? 'ml-[320px]' : '',
                direction === 'center' && 'mx-auto',
                width ? `w-[${width}px]` : 'w-full',
                className
            )}
        >
            <div
                className={cn(
                    'flex-grow', // Tự động chiếm không gian còn lại
                    direction === 'right' && 'md:ml-0' // Xử lý khi nhỏ màn hình
                )}
                style={{
                    width: `calc(100vw - 320px)`, // Giới hạn chiều rộng trừ sidebar
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default Container;
