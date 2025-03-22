import { getMessageByMessageId } from '@/lib/actions/message.action';
import { getAuthSession } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { ChatBox } from '../_components';
import { getConversationById } from '@/lib/actions/conversation.action';

interface Props {
    params: Promise<{ conversationId: string }>;
    searchParams: Promise<{ findMessage: string }>;
}

const ConversationPage: React.FC<Props> = async ({ params, searchParams }) => {
    const session = await getAuthSession();
    if (!session) return null;

    const { conversationId } = await params;
    const { findMessage } = await searchParams;

    const conversation = (await getConversationById({
        conversationId,
    })) as IConversation;

    // Kiểm tra xem cuộc trò chuyện có tồn tại không
    if (!conversation) return notFound();

    // Kiểm tra xem người dùng có trong cuộc trò chuyện không
    if (conversation && conversation.participants) {
        if (!conversation.participants.find((p) => p._id === session.user.id)) {
            return redirect('/messages');
        }
    }

    if (findMessage) {
        const message = (await getMessageByMessageId({
            messageId: findMessage,
        })) as IMessage;
        return <ChatBox conversation={conversation} findMessage={message} />;
    } else {
        return <ChatBox conversation={conversation} />;
    }
};

export default ConversationPage;
