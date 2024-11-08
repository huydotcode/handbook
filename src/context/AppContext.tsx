'use client';
import socketEvent from '@/constants/socketEvent.constant';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSocial } from '.';
import { socket } from '@/lib/socket';

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
