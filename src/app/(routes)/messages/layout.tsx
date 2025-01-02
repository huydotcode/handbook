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
            <div className={'flex flex-1'}>{children}</div>
        </FixedLayout>
    );
};
export default MessageLayout;
