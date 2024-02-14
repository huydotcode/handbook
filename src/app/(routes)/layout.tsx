import { Navbar } from '@/components/layout';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = async ({ children }) => {
    return (
        <div>
            <Navbar />

            <main className="relative top-[72px] mx-auto min-h-[calc(100vh-56px)] w-[1000px] max-w-[100vw] md:w-screen">
                {children}
            </main>
        </div>
    );
};

export default HomeLayout;
