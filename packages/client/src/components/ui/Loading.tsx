'use client';
import { cn } from '@/lib/utils';
import React, { FC, useEffect } from 'react';

interface Props {
    className?: string;
    fullScreen?: boolean;
    title?: string;
    overlay?: boolean;
    text?: string;
}

const Loading: FC<Props> = ({
    fullScreen,
    className,
    title,
    overlay = true,
    text: initText,
}) => {
    const [text, setText] = React.useState<string>(initText || '');

    useEffect(() => {
        if (initText) {
            const interval = setInterval(() => {
                setText((prev) => {
                    if (prev.length === initText.length + 3) return '';
                    return prev + '.';
                });
            }, 500);

            return () => {
                clearInterval(interval);
            };
        }
    }, [initText]);

    if (initText && initText.length > 0) {
        return (
            <div
                className={cn(
                    'flex justify-center text-xs text-secondary-1',
                    className
                )}
            >
                {text}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'loader-container flex items-center justify-center overflow-hidden',
                fullScreen && 'fixed left-0 top-0 z-50 h-screen w-screen',
                title && 'flex-col',
                overlay && 'bg-black bg-opacity-10',
                className
            )}
        >
            <div className="loader">
                <li className="ball"></li>
                <li className="ball"></li>
                <li className="ball"></li>
            </div>

            {title && <p className="mt-2 text-lg text-white">{title}</p>}
        </div>
    );
};

export default Loading;
