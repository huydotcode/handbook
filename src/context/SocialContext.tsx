'use client';
import { getLastMessageByCoversationId } from '@/lib/actions/message.action';
import {
    getConversationsKey,
    getFriendsKey,
    getLastMessagesKey,
    getMessagesKey,
    getProfileKey,
} from '@/lib/queryKey';
import {
    useInfiniteQuery,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useSocket } from './SocketContext';

const PAGE_SIZE = 10;

export const useProfile = (userId: string) =>
    useQuery<IProfile>({
        queryKey: getProfileKey(userId),
        queryFn: async () => {
            const res = await fetch(`/api/profile?userid=${userId}`);
            const data = await res.json();
            return data;
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry: false,
    });

export const useFriends = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: getFriendsKey(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const res = await fetch(
                `/api/friends?userId=${userId}&page=${pageParam}&pageSize=${PAGE_SIZE}`
            );
            const friends = await res.json();
            return friends;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        },
        select: (data) => {
            return data.pages.flatMap((page) => page) as IUser[];
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry: false,
    });

export const useConversations = (userId: string | undefined) =>
    useQuery<IConversation[]>({
        queryKey: getConversationsKey(userId),
        queryFn: async () => {
            if (!userId) return [];

            const res = await fetch(`/api/conversations?userId=${userId}`);
            const conversations = await res.json();
            return conversations;
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

export const useMessages = (conversationId: string | undefined) =>
    useInfiniteQuery({
        queryKey: getMessagesKey(conversationId),
        queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
            if (!conversationId) return [];

            const res = await fetch(
                `/api/messages?conversationId=${conversationId}&page=${pageParam}&pageSize=${PAGE_SIZE}`
            );

            const messages = await res.json();

            return messages;
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
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

function SocialProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { socketEmitor } = useSocket();
    const queryClient = useQueryClient();

    const { data: conversations, refetch: refetchConversations } =
        useConversations(session?.user.id);

    useEffect(() => {
        if (!session?.user?.id || !conversations) return;

        conversations.forEach((conversation) => {
            socketEmitor.joinRoom({
                roomId: conversation._id,
                userId: session?.user.id,
            });
        });
    }, [conversations, session?.user?.id]);

    return <>{children}</>;
}

export default SocialProvider;
