import { Navbar } from '@/components/layout';
import React from 'react';
import { Sidebar } from './_components';

interface Props {
    children: React.ReactNode;
}

const MessageLayout: React.FC<Props> = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="fixed top-[56px] flex h-[calc(100vh-56px)] w-screen justify-between overflow-hidden">
                <Sidebar />
                {children}
            </div>
        </>
    );
};
export default MessageLayout;
