import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    children: React.ReactNode;
}

const Container: React.FC<Props> = ({ className, children }) => {
    return (
        <div className={cn('ml-[300px] mt-[56px] h-screen md:ml-0', className)}>
            {children}
        </div>
    );
};

export default Container;
