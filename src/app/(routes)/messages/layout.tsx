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
                    'relative flex h-full w-full flex-1 rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none'
                }
            >
                {children}
            </div>
        </FixedLayout>
    );
};
export default MessageLayout;
