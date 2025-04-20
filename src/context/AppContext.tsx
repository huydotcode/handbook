'use client';
import { notificationType } from '@/constants/notificationType';
import socketEvent from '@/constants/socketEvent.constant';
import { getCategories } from '@/lib/actions/category.action';
import {
    getCategoriesKey,
    getFriendsKey,
    getGroupsKey,
    getLocationsKey,
    getNotificationsKey,
    getRequestsKey,
} from '@/lib/queryKey';
import {
    useInfiniteQuery,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from '.';
import axiosInstance from '@/lib/axios';

const PAGE_SIZE = 5;

export const useNotifications = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: getNotificationsKey(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const res = await axiosInstance.get('/notifications', {
                params: {
                    user_id: userId,
                    page: pageParam,
                    page_size: PAGE_SIZE,
                },
            });

            return res.data;
        },
        select: (data) => {
            return data.pages.flatMap((page) => page);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE
                ? allPages.length + 1
                : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            return firstPage.length === PAGE_SIZE ? 1 : undefined;
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

export const useCategories = () =>
    useQuery<ICategory[]>({
        queryKey: getCategoriesKey(),
        queryFn: async () => {
            const categories = await getCategories();
            return categories;
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

export const useGroupsJoined = (userId: string | undefined) => {
    return useInfiniteQuery({
        queryKey: getGroupsKey(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const res = await axiosInstance.get('/groups/joined', {
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
            return lastPage.length === PAGE_SIZE
                ? allPages.length + 1
                : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            return firstPage.length === PAGE_SIZE ? 1 : undefined;
        },
        select: (data) => {
            return data.pages.flatMap((page) => page);
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
};

export const useRequests = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: getRequestsKey(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const res = await axiosInstance.get('/requests', {
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
            return lastPage.length === PAGE_SIZE
                ? allPages.length + 1
                : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            return firstPage.length === PAGE_SIZE ? 1 : undefined;
        },
        select: (data) => {
            return data.pages.flatMap((page) => page);
        },
        enabled: !!userId,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

export const useLocations = () =>
    useQuery<ILocation[]>({
        queryKey: getLocationsKey(),
        queryFn: async () => {
            const res = await axiosInstance.get('/locations');

            return res.data;
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

function AppProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    const { socket } = useSocket();
    const queryClient = useQueryClient();

    // Lắng nghe thông báo mới
    useEffect(() => {
        if (!session?.user?.id || !socket) return;

        socket.on(
            socketEvent.RECEIVE_NOTIFICATION,
            async ({ notification }: { notification: INotification }) => {
                if (notification.type === notificationType.ACCEPT_FRIEND) {
                    toast.success(
                        `${notification.sender.name} đã chấp nhận lời mời kết bạn`,
                        {
                            id: notification._id,
                            position: 'bottom-left',
                            className: 'text-sm',
                        }
                    );

                    queryClient.invalidateQueries({
                        queryKey: getFriendsKey(session?.user.id),
                    });
                }

                queryClient.invalidateQueries({
                    queryKey: getNotificationsKey(session?.user.id),
                });
            }
        );
    }, [socket, session?.user.id, queryClient]);

    useEffect(() => {
        if (!session || !session?.user) {
            localStorage.removeItem('accessToken');
            return;
        }
        if (!session?.user.accessToken) return;

        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            localStorage.removeItem('accessToken');
        }

        localStorage.setItem('accessToken', session?.user.accessToken);
    }, [session?.user]);

    return <>{children}</>;
}

export default AppProvider;
