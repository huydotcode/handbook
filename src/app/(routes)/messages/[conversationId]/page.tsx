import { getConversationById } from '@/lib/actions/conversation.action';
import { getAuthSession } from '@/lib/auth';
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
    const session = await getAuthSession();
    if (!session) return null;

    const conversation = (await getConversationById({
        conversationId,
    })) as IConversation;

    // Kiểm tra xem cuộc trò chuyện có tồn tại không
    if (!conversation) {
        redirect('/messages');
    }

    // Kiểm tra xem người dùng có trong cuộc trò chuyện không
    if (!conversation.participants.find((p) => p._id === session.user.id)) {
        redirect('/messages');
    }

    return <ChatBox conversation={conversation} />;
};

export default ConversationPage;
