import { getMessageByMessageId } from '@/lib/actions/message.action';
import { getAuthSession } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { ChatBox } from '../_components';

interface Props {
    params: Promise<{ conversationId: string }>;
    searchParams: Promise<{ findMessage: string }>;
}

const getConversationById = async ({
    conversationId,
}: {
    conversationId: string;
}) => {
    try {
        const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/conversations/${conversationId}`
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

const ConversationPage: React.FC<Props> = async ({ params, searchParams }) => {
    const session = await getAuthSession();
    if (!session) return null;

    const { conversationId } = await params;
    const { findMessage } = await searchParams;

    const conversation = (await getConversationById({
        conversationId,
    })) as IConversation;

    // Kiểm tra xem cuộc trò chuyện có tồn tại không
    if (!conversation) {
        console.log("conversation doesn't exist");
        notFound();
    }

    // Kiểm tra xem người dùng có trong cuộc trò chuyện không
    if (conversation && conversation.participants) {
        if (!conversation.participants.find((p) => p._id === session.user.id)) {
            console.log("user doesn't exist in conversation");
            redirect('/messages');
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
