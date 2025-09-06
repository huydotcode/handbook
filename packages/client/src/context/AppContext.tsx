'use client';
import { API_ROUTES } from '@/config/api';
import { notificationType } from '@/constants/notificationType';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import { soundManager } from '@/lib/soundManager';
import { socketEvent } from '@handbook/shared';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from '.';
import { SidebarCollapseContext } from './SidebarContext';

const PAGE_SIZE = 10;

export const useNotifications = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: queryKey.user.notifications(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const res = await axiosInstance.get(
                API_ROUTES.NOTIFICATIONS.INDEX,
                {
                    params: {
                        user_id: userId,
                        page: pageParam,
                        page_size: PAGE_SIZE,
                    },
                }
            );

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
        queryKey: queryKey.categories,
        queryFn: async () => {
            const res = await axiosInstance.get(API_ROUTES.CATEGORIES.INDEX);
            const categories = res.data;
            return categories;
        },
    });

export const useGroupsJoined = (userId: string | undefined) => {
    return useInfiniteQuery({
        queryKey: queryKey.user.groups(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const res = await axiosInstance.get(API_ROUTES.GROUP.JOINED, {
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
        queryKey: queryKey.user.requests(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const res = await axiosInstance.get(API_ROUTES.REQUESTS.INDEX, {
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
        queryKey: queryKey.locations,
        queryFn: async () => {
            const res = await axiosInstance.get(API_ROUTES.LOCATIONS.INDEX);

            return res.data;
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

function AppProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { invalidateFriends, invalidateNotifications } =
        useQueryInvalidation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { socket } = useSocket();

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
                }

                await invalidateFriends(session?.user.id);
                await invalidateNotifications(session?.user.id as string);
            }
        );
    }, [socket, session?.user.id, invalidateFriends, invalidateNotifications]);

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
    }, [session, session?.user]);

    // Preload các âm thanh
    useEffect(() => {
        soundManager.preload(
            'message',
            '/assets/sounds/message-notification.mp3'
        );
        soundManager.preload('phone-ring', '/assets/sounds/phone-ring.mp3');
    }, []);

    return (
        <SidebarCollapseContext.Provider
            value={{
                isSidebarOpen,
                setIsSidebarOpen,
            }}
        >
            {children}
        </SidebarCollapseContext.Provider>
    );
}

export default AppProvider;
