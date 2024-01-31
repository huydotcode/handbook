import React from 'react';
import { Navbar } from '@/components/layout';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = async ({ children }) => {
    return (
        <div>
            <Navbar />

            <main className="relative top-14 flex justify-between w-[1150px] md:w-screen mx-auto min-h-[calc(100vh-56px)]">
                {children}
            </main>
        </div>
    );
};

export default HomeLayout;
