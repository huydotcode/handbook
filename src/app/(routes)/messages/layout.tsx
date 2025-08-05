import FixedLayout from '@/components/layout/FixedLayout';
import React from 'react';
import { Sidebar } from './_components';
import { Navbar } from '@/components/layout';
interface Props {
    children: React.ReactNode;
}

export async function generateMetadata() {
    return {
        title: 'Messenger | Handbook',
    };
}

const MessageLayout: React.FC<Props> = async ({ children }) => {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            <div className="relative top-[60px]">
                <Sidebar />

                <div className="relative my-1 ml-[310px] h-[calc(100vh-72px)] overflow-hidden rounded-xl lg:ml-[90px] sm:ml-0">
                    {children}
                </div>
            </div>
        </div>
    );
};
export default MessageLayout;
