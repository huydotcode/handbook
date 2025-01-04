import FixedLayout from '@/components/layout/FixedLayout';
import React from 'react';
import { Sidebar } from './_components';
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
        <FixedLayout fullScreen>
            <Sidebar />
            <div
                className={
                    'fixed left-[320px] top-2 flex h-[calc(100vh-72px)] w-[calc(100vw-330px)] rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none lg:left-[96px] lg:w-[calc(100vw-104px)] sm:left-0 sm:w-screen'
                }
            >
                {children}
            </div>
        </FixedLayout>
    );
};
export default MessageLayout;
