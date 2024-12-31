import FixedLayout from '@/components/layout/FixedLayout';
import { getAuthSession } from '@/lib/auth';
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
    const session = await getAuthSession();
    if (!session) return null;

    return (
        <FixedLayout fullScreen>
            <Sidebar />
            <div className={'flex flex-1'}>{children}</div>
        </FixedLayout>
    );
};
export default MessageLayout;
