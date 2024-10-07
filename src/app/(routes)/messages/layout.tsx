import { Navbar } from '@/components/layout';
import { getAuthSession } from '@/lib/auth';
import { ConversationService } from '@/lib/services';
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

    const conversations = await ConversationService.getConversationsByUserId({
        userId: session.user.id,
    });

    if (!conversations) return null;

    return (
        <div>
            <Navbar />
            <div className="relative left-1/2 flex h-[calc(100vh-56px)] min-w-[80%] max-w-[1876px] -translate-x-1/2 justify-between rounded-xl bg-transparent p-2 md:min-w-full">
                <Sidebar conversations={conversations} />
                {children}
            </div>
        </div>
    );
};
export default MessageLayout;
