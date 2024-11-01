import React from 'react';
import { Navbar } from '@/components/layout';
import ChatWithGemini from '@/components/ChatWithGemini';
import { Sidebar } from '@/app/(routes)/messages/_components';

interface Props {
    children: React.ReactNode;
}

const FixedLayout: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <Navbar />
            <div className="relative left-1/2 top-[56px] flex h-[calc(100vh-56px)] min-w-[80%] max-w-[1876px] -translate-x-1/2 justify-between rounded-xl bg-transparent p-2 md:min-w-full">
                {children}
            </div>
        </div>
    );
};

export default FixedLayout;
