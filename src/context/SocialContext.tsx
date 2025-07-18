'use client';
import { API_ROUTES } from '@/config/api';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import ProfileService from '@/lib/services/profile.service';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useSocket } from './SocketContext';

const PAGE_SIZE = 10;

export const useProfile = (userId: string) =>
    useQuery<IProfile>({
        queryKey: queryKey.user.profile(userId),
        queryFn: async () => {
            const data = await ProfileService.getByUserId(userId);
            if (!data) {
                throw new Error('Profile not found');
            }
            return data;
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

export const useFriends = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: queryKey.user.friends(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const res = await axiosInstance.get(API_ROUTES.USER.FRIENDS, {
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
        queryKey: queryKey.conversations.userId(userId),
        queryFn: async () => {
            if (!userId) return [];

            const res = await axiosInstance.get(
                API_ROUTES.CONVERSATIONS.GET_BY_USER(userId)
            );
            const conversations = res.data;
            return conversations;
        },
        enabled: !!userId,
    });

export const useConversation = (conversationId: string | undefined) => {
    const { data: session } = useSession();

    return useQuery<IConversation | null>({
        queryKey: queryKey.conversations.id(conversationId),
        queryFn: async () => {
            try {
                const res = await axiosInstance.get(
                    API_ROUTES.CONVERSATIONS.ID(conversationId as string)
                );
                return res.data;
            } catch (error) {
                return null;
            }
        },
        enabled: !!conversationId && !!session?.user.id,
        retry: false,
    });
};

export const useMessages = (conversationId: string | undefined) =>
    useInfiniteQuery({
        queryKey: queryKey.messages.conversationId(conversationId),
        queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
            if (!conversationId) return [];

            const res = await axiosInstance.get(API_ROUTES.MESSAGES.INDEX, {
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

export const useFollowing = (userId: string | undefined) =>
    useQuery<IFollow[]>({
        queryKey: queryKey.user.followings(userId),
        queryFn: async () => {
            if (!userId) return [];

            const res = await axiosInstance.get(
                API_ROUTES.USER.FOLLOWINGS(userId)
            );

            return res.data;
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

function SocialProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { socketEmitor, isConnected } = useSocket();
    const { data: conversations } = useConversations(session?.user.id);

    useEffect(() => {
        if (!session?.user?.id || !conversations || !isConnected) return;

        conversations.forEach((conversation) => {
            if (
                !conversation.participants.some(
                    (p) => p._id === session.user.id
                )
            )
                return;
            if (conversation.isDeletedBy?.includes(session.user.id)) return;

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
