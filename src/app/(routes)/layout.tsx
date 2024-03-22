import { Navbar } from '@/components/layout';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = async ({ children }) => {
    return (
        <div>
            <Navbar />

            <main className="relative top-[56px] mx-auto min-h-[calc(100vh-56px)] w-[1000px] max-w-screen md:w-screen">
                {children}
            </main>
        </div>
    );
};

export default HomeLayout;
