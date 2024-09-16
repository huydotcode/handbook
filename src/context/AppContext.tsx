'use client';
import socketEvent from '@/constants/socketEvent.constant';
import NotificationService from '@/lib/services/notification.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect } from 'react';
import { useSocket } from '.';

type AppContextType = {
    notifications: INotification[];
    loadingNotifications: boolean;
};

export const AppContext = createContext<AppContextType>({
    notifications: [],
    loadingNotifications: true,
});

export const useApp = () => useContext(AppContext);

function AppProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications', session?.user],
        queryFn: async () => {
            const notifications =
                await NotificationService.getNotificationByUserId({
                    userId: session?.user.id as string,
                });

            return notifications;
        },
        initialData: [],
    });

    const { socket } = useSocket();

    // Lắng nghe thông báo mới
    useEffect(() => {
        if (socket) {
            socket.on(
                socketEvent.RECEIVE_NOTIFICATION,
                ({ notification }: { notification: INotification }) => {
                    queryClient.setQueryData(
                        ['notifications'],
                        (prev: INotification[]) => [notification, ...prev]
                    );
                }
            );
        }
    }, [socket]);

    const values = {
        notifications,
        loadingNotifications: isLoading,
    };

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export default AppProvider;
