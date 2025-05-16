'use client';
import { useSocket } from '@/context';
import { useConversations } from '@/context/SocialContext';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { useSession } from 'next-auth/react';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { ChatBox } from '../_components';

interface Props {}

const ConversationPage: React.FC<Props> = ({}) => {
    const params = useParams();
    const searchParams = useSearchParams();
    const { conversationId } = params;
    const { socketEmitor } = useSocket();
    const { invalidateMessages } = useQueryInvalidation();
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

    useEffect(() => {
        if (!socketEmitor) return;
        if (!session) return;

        if (conversation) {
            socketEmitor.joinRoom({
                roomId: conversation._id,
                userId: session?.user.id,
            });
        }
        return () => {
            if (conversation) {
                socketEmitor.leaveRoom({
                    roomId: conversation._id,
                    userId: session?.user.id,
                });
            }
        };
    }, [conversation, session, socketEmitor]);

    useEffect(() => {
        if (!conversation) return;
        if (!session) return;

        invalidateMessages(conversation._id);
    }, [conversation, invalidateMessages, session]);

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
