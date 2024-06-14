import { getAuthSession } from '@/lib/auth';
import { ConversationService, MessageService } from '@/lib/services';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { ChatBox } from '../_components';

interface Props {
    params: {
        conversationId: string;
    };
}

const ConversationPage: React.FC<Props> = async ({
    params: { conversationId },
}) => {
    const session = (await getAuthSession()) as Session;
    if (!session) redirect('/');

    const conversation = (await ConversationService.getConversationById({
        conversationId,
    })) as IConversation;

    if (!conversation) redirect('/messages');

    const initialMessages = (await MessageService.getMessages({
        conversationId,
        page: 1,
        pageSize: 20,
    })) as IMessage[];

    return (
        <>
            <ChatBox
                conversation={conversation}
                initialMessages={initialMessages}
            />
        </>
    );
};

export default ConversationPage;
