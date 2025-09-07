import FixedLayout from '@/components/layout/FixedLayout';
import React from 'react';
import Sidebar from '@/app/(routes)/news-feed/_components/Sidebar';

interface Props {
    children: React.ReactNode;
}

export async function generateMetadata() {
    return {
        title: 'News Feed | Handbook',
    };
}

const NewsFeedLayout: React.FC<Props> = async ({ children }) => {
    return (
        <div className="relative top-[56px] min-h-[calc(100vh-56px)] max-w-screen md:w-screen">
            <Sidebar />
            <div className="ml-[300px] mt-2 w-[calc(100vw-300px)] lg:ml-0 lg:w-full">
                {children}
            </div>
        </div>
    );
};

export default NewsFeedLayout;
