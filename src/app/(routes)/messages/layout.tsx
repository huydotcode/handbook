import { Navbar } from '@/components/layout';
import { getAuthSession } from '@/lib/auth';
import { ConversationService } from '@/lib/services';
import React from 'react';
import { Sidebar } from './_components';
import FixedLayout from '@/components/layout/FixedLayout';

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

    const conversations = await ConversationService.getConversationsByUserId({
        userId: session.user.id,
    });

    if (!conversations) return null;

    return (
        <FixedLayout fullScreen>
            <Sidebar conversations={conversations} />
            <div className={'flex flex-1'}>{children}</div>
        </FixedLayout>
    );
};
export default MessageLayout;
