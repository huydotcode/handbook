'use client';
import { getConversationsByUserId } from '@/lib/actions/conversation.action';
import { getLastMessageByCoversationId } from '@/lib/actions/message.action';
import {
    getFollowersByUserId,
    getFriendsByUserId,
} from '@/lib/actions/user.action';
import {
    getConversationsKey,
    getFollowersKey,
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
import { getProfileByUserId } from '@/lib/actions/profile.action';

export const useProfile = (userId: string) =>
    useQuery<IProfile>({
        queryKey: getProfileKey(userId),
        queryFn: async () => {
            const res = await fetch(`/api/profile?userid=${userId}`);
            const data = await res.json();

            return data.profile;
        },
        enabled: !!userId,
    });

export const useFriends = (userId: string | undefined) =>
    useQuery<IFriend[]>({
        queryKey: getFriendsKey(userId),
        queryFn: async () => {
            if (!userId) return [];

            const res = await fetch(`/api/friends`);
            const data = await res.json();
            const friends = data.friends;

            return friends;
        },
    });

export const useFollowers = (userId: string | undefined) =>
    useQuery<IFriend[]>({
        queryKey: getFollowersKey(userId),
        queryFn: async () => {
            if (!userId) return [];

            const followers = await getFollowersByUserId({ userId });
            return followers;
        },
        enabled: !!userId,
    });

export const useConversations = (userId: string | undefined) =>
    useQuery<IConversation[]>({
        queryKey: getConversationsKey(userId),
        queryFn: async () => {
            if (!userId) return [];

            const res = await fetch(`/api/conversations?userId=${userId}`);
            const data = await res.json();
            const conversations = data.conversations;
            return conversations;
        },
        enabled: !!userId,
    });

const PAGE_SIZE = 10;

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
