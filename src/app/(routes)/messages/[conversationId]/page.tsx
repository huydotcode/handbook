import { ConversationService, MessageService } from '@/lib/services';
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
    const conversation = (await ConversationService.getConversationById({
        conversationId,
    })) as IConversation;

    const initialMessages = (await MessageService.getMessages({
        conversationId,
        page: 1,
        pageSize: 20,
    })) as IMessage[];

    if (!conversation) redirect('/messages');

    return (
        <ChatBox
            conversation={conversation}
            initialMessages={initialMessages}
        />
    );
};

export default ConversationPage;
