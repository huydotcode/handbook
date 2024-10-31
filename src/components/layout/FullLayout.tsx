import React from 'react';
import { Navbar } from '@/components/layout';
import ChatWithGemini from '@/components/ChatWithGemini';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    children: React.ReactNode;
}

const FullLayout: React.FC<Props> = ({ className, children }) => {
    return (
        <div className={cn('relative', className)}>
            <Navbar />

            <main>{children}</main>

            <ChatWithGemini />
        </div>
    );
};

export default FullLayout;
