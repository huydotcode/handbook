import ChatWithGemini from '@/components/ChatWithGemini';
import { Navbar } from '@/components/layout';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className="relative">
            <Navbar />

            <main className="relative top-[56px] mx-auto min-h-[calc(100vh-56px)] w-[1200px] max-w-screen md:w-screen">
                {children}
            </main>

            <ChatWithGemini />
        </div>
    );
};

export default HomeLayout;
