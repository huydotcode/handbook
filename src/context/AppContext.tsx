'use client';
import socketEvent from '@/constants/socketEvent.constant';
import NotificationService from '@/lib/services/notification.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSocial, useSocket } from '.';

type AppContextType = {
    notifications: INotification[];
    setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
    loadingNotifications: boolean;
};

export const AppContext = createContext<AppContextType>({
    notifications: [],
    setNotifications: () => {},
    loadingNotifications: true,
});

export const useApp = () => useContext(AppContext);

function AppProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<INotification[]>([]);

    const { socket } = useSocket();
    const { setFriends } = useSocial();

    // Lắng nghe thông báo mới
    useEffect(() => {
        if (socket) {
            socket.on(
                socketEvent.RECEIVE_NOTIFICATION,
                ({ notification }: { notification: INotification }) => {
                    if (notification.type === 'accept-friend') {
                        setFriends((prev) => [notification.sender, ...prev]);
                    }

                    setNotifications((prev) => [notification, ...prev]);
                }
            );
        }
    }, [socket]);

    const values = {
        notifications,
        setNotifications,
        loadingNotifications: false,
    };

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export default AppProvider;
