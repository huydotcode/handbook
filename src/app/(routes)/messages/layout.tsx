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
                    'fixed bottom-0 left-[310px] top-2 flex h-[calc(100vh-72px)] w-[calc(100vw-320px)] rounded-xl  shadow-xl  dark:shadow-none lg:left-[90px] lg:w-[calc(100vw-98px)] sm:left-0 sm:w-screen'
                }
            >
                {children}
            </div>
        </FixedLayout>
    );
};
export default MessageLayout;
