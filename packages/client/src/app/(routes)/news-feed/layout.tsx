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
        <FixedLayout fullScreen>
            <Sidebar />
            <div
                className={
                    'h-[calc(100vh-64px] fixed bottom-0 left-[360px] top-2 w-[calc(100vw-360px)] overflow-y-scroll lg:left-[90px] lg:top-2 lg:h-[calc(100vh-64px)] lg:w-[calc(100vw-90px)] lg:overflow-y-scroll'
                }
            >
                {children}
            </div>
        </FixedLayout>
    );
};

export default NewsFeedLayout;
