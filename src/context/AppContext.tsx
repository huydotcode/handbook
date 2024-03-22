'use client';
import socketEvent from '@/constants/socketEvent.constant';
import NotificationService from '@/lib/services/notification.service';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from '.';

/*
    * AppContext
    1. Lấy ra thông tin notification
*/

type AppContextType = {
    notifications: INotification[];
    loadingNotifications: boolean;
    setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
};

export const AppContext = createContext<AppContextType>({
    notifications: [],
    loadingNotifications: true,
    setNotifications: () => {},
});

export const useApp = () => useContext(AppContext);

function AppProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [loadingNotifications, setLoadingNotifications] =
        useState<boolean>(true);

    // Lắng nghe thông báo mới
    useEffect(() => {
        if (socket) {
            socket.on(
                socketEvent.RECEIVE_NOTIFICATION,
                ({ notification }: { notification: INotification }) => {
                    setNotifications((prev) => [notification, ...prev]);
                }
            );
        }
    }, [socket]);

    // Lấy ra thông báo mới nhất
    useEffect(() => {
        (async () => {
            try {
                const notifications =
                    await NotificationService.getNotifications();

                setNotifications(notifications);
            } catch (error) {
                toast.error('Đã có lỗi xảy ra khi lấy thông báo');
            } finally {
                setLoadingNotifications(false);
            }
        })();
    }, [session?.user.id]);

    const values = {
        notifications,
        setNotifications,
        loadingNotifications,
    };

    if (!session) return children;

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export default AppProvider;
