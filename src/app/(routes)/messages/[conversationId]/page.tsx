'use client';
import { useConversations } from '@/context/SocialContext';
import { useSession } from 'next-auth/react';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { ChatBox } from '../_components';

interface Props {}

const ConversationPage: React.FC<Props> = ({}) => {
    const params = useParams();
    const searchParams = useSearchParams();
    const { conversationId } = params;
    const findMessage = searchParams.get('find_msg') || '';

    const { data: session } = useSession();
    const { data: coversations, isLoading } = useConversations(
        session?.user.id as string
    );

    const conversation = useMemo(() => {
        return coversations?.find(
            (conversation) => conversation._id === conversationId
        );
    }, [coversations, conversationId]);

    useEffect(() => {
        if (!isLoading && !conversation) {
            notFound();
        }
    }, [conversation, isLoading]);

    return (
        <>
            {conversation && (
                <ChatBox
                    conversation={conversation}
                    findMessage={findMessage}
                />
            )}
        </>
    );
};

export default ConversationPage;
