import { cn } from '@/lib/utils';
import React, { FC } from 'react';

interface Props {
    className?: string;
    fullScreen?: boolean;
}

const Loading: FC<Props> = ({ fullScreen, className }) => {
    return (
        <div
            className={cn(
                'loader-container flex items-center justify-center overflow-hidden',
                className,
                fullScreen && 'fixed left-0 top-0 z-50 h-screen w-screen'
            )}
        >
            <div className="loader">
                <li className="ball"></li>
                <li className="ball"></li>
                <li className="ball"></li>
            </div>
        </div>
    );
};

export default Loading;
