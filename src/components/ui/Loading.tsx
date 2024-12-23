import { cn } from '@/lib/utils';
import React, { FC } from 'react';

interface Props {
    className?: string;
    fullScreen?: boolean;
    title?: string;
}

const Loading: FC<Props> = ({ fullScreen, className, title }) => {
    return (
        <div
            className={cn(
                'loader-container flex items-center justify-center overflow-hidden',
                fullScreen &&
                    'fixed left-0 top-0 z-50 h-screen w-screen bg-black bg-opacity-10',
                className,
                title && 'flex-col'
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
