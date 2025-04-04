'use client';
import { getLastMessageByCoversationId } from '@/lib/actions/message.action';
import {
    getConversationsKey,
    getFriendsKey,
    getLastMessagesKey,
    getMessagesKey,
    getProfileKey,
} from '@/lib/queryKey';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useSocket } from './SocketContext';
import axiosInstance from '@/lib/axios';
import { getProfileByUserId } from '@/lib/actions/profile.action';

const PAGE_SIZE = 10;

export const useProfile = (userId: string) =>
    useQuery<IProfile>({
        queryKey: getProfileKey(userId),
        queryFn: async () => {
            const data = await getProfileByUserId({
                query: userId,
            });
            return data;
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

export const useFriends = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: getFriendsKey(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const res = await axiosInstance.get('/user/friends', {
                params: {
                    user_id: userId,
                    page: pageParam,
                    page_size: PAGE_SIZE,
                },
            });

            return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        },
        select: (data) => {
            return data.pages.flatMap((page) => page) as IUser[];
        },
        enabled: !!userId,
    });

export const useConversations = (userId: string | undefined) =>
    useQuery<IConversation[]>({
        queryKey: getConversationsKey(userId),
        queryFn: async () => {
            if (!userId) return [];

            const res = await axiosInstance.get(
                `/conversations?user_id=${userId}`
            );
            const conversations = res.data;
            return conversations;
        },
        enabled: !!userId,
    });

export const useMessages = (conversationId: string | undefined) =>
    useInfiniteQuery({
        queryKey: getMessagesKey(conversationId),
        queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
            if (!conversationId) return [];

            const res = await axiosInstance.get('/message', {
                params: {
                    conversation_id: conversationId,
                    page: pageParam,
                    page_size: PAGE_SIZE,
                },
            });

            return res.data;
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!conversationId,
        // Seclect data thành một mảng
        select: (data) => {
            return data.pages.flatMap((page) => page) as IMessage[];
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

export const useLastMessage = (conversationId: string) =>
    useQuery<IMessage>({
        queryKey: getLastMessagesKey(conversationId),
        queryFn: async () => {
            const lastMessage = await getLastMessageByCoversationId({
                conversationId: conversationId,
            });
            return lastMessage;
        },
        enabled: !!conversationId,
    });

function SocialProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { socketEmitor, isConnected } = useSocket();
    const { data: conversations } = useConversations(session?.user.id);

    useEffect(() => {
        if (!session?.user?.id || !conversations || !isConnected) return;

        conversations.forEach((conversation) => {
            socketEmitor.joinRoom({
                roomId: conversation._id,
                userId: session?.user.id,
            });
        });

        return () => {
            conversations.forEach((conversation) => {
                socketEmitor.leaveRoom({
                    roomId: conversation._id,
                    userId: session?.user.id,
                });
            });
        };
    }, [conversations, session?.user.id, socketEmitor, isConnected]);

    return <>{children}</>;
}

export default SocialProvider;
