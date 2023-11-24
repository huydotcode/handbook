import React from 'react';
import { Navbar } from '@/components/layout';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = async ({ children }) => {
    return (
        <div className="block">
            <Navbar />

            <main className="relative top-14 flex justify-between w-full min-h-[calc(100vh-56px)]">
                {children}
            </main>
        </div>
    );
};

export default HomeLayout;
