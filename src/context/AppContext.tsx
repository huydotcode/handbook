'use client';
import { notificationType } from '@/constants/notificationType';
import socketEvent from '@/constants/socketEvent.constant';
import {
    getNotificationByUserId,
    getRequestByUserId,
} from '@/lib/actions/notification.action';
import {
    getCategoriesKey,
    getFriendsKey,
    getNotificationsKey,
    getRequestsKey,
} from '@/lib/queryKey';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from '.';
import { getCategories } from '@/lib/actions/category.action';

export const useNotifications = (userId: string | undefined) =>
    useQuery<INotification[]>({
        queryKey: getNotificationsKey(userId),
        queryFn: async () => {
            if (!userId) return [];

            const notifications = await getNotificationByUserId({ userId });
            return notifications;
        },
        enabled: !!userId,
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

export const useRequests = (userId: string | undefined) =>
    useQuery<INotification[]>({
        queryKey: getRequestsKey(userId),
        queryFn: async () => {
            if (!userId) return [];

            const requests = await getRequestByUserId({ userId });
            return requests;
        },
    });

function AppProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useNotifications(session?.user.id);
    useRequests(session?.user.id);

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
    }, [socket, session?.user?.id]);

    return <>{children}</>;
}

export default AppProvider;
