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
                'flex items-center justify-center overflow-hidden',
                className,
                fullScreen && 'w-screen h-[calc(100vh-56px)]'
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
