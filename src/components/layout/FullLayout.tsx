import React from 'react';
import { Navbar } from '@/components/layout';
import ChatWithGemini from '@/components/layout/ChatWithGemini';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    children: React.ReactNode;
}

const FullLayout: React.FC<Props> = ({ className, children }) => {
    return (
        <div className={cn('w-screen', className)}>
            <Navbar />

            <main className={'bg-primary-1 dark:bg-dark-primary-1'}>
                {children}
            </main>

            <ChatWithGemini />
        </div>
    );
};

export default FullLayout;
