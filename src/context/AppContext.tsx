'use client';
import { useAudio } from '@/hooks';
import { getGroups } from '@/lib/actions/group.action';
import { fetchFriends, fetchNotifications } from '@/lib/actions/user.action';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from './SocketContext';

type AppContextType = {
    friends: IFriend[];
    loadingFriends: boolean;

    notifications: INotification[];
    loadingNotifications: boolean;

    groups: IGroup[];
    loadingGroups: boolean;
    setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;

    handleAcceptFriend: ({
        notificationId,
        senderId,
    }: {
        notificationId: string;
        senderId: string;
    }) => void;

    handleDeclineFriend: ({
        notificationId,
        senderId,
    }: {
        notificationId: string;
        senderId: string;
    }) => void;
};

const AppContext = createContext<AppContextType | any>({});

export const useApp = () => {
    return useContext(AppContext) as AppContextType;
};

interface Loading {
    friend: boolean;
    notification: boolean;
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();
    const { socket } = useSocket();
    const [friends, setFriends] = useState<IFriend[]>([]);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [groups, setGroups] = useState<IGroup[]>([]);

    const [loading, setLoading] = useState<Loading>({
        friend: true,
        notification: true,
    });

    const { playing, toggle: togglePlayingSound } = useAudio({
        type: 'message',
    });

    useEffect(() => {
        if (session?.user?.id) {
            (async () => {
                const friends = await fetchFriends({
                    userId: session.user.id,
                });
                setFriends(friends);
                setLoading((prev) => ({ ...prev, friend: false }));

                const notifications = await fetchNotifications({
                    userId: session.user.id,
                });
                setNotifications(notifications);
                setLoading((prev) => ({ ...prev, notification: false }));
            })();
        }
    }, [session?.user?.id]);

    const handleAcceptFriend = ({
        notificationId,
        senderId,
    }: {
        notificationId: string;
        senderId: string;
    }) => {
        if (!socket) return;

        socket.emit('accept-request-add-friend', {
            notificationId,
            senderId,
        });

        setNotifications((prev) =>
            prev.filter((notification) => notification._id !== notificationId)
        );
    };

    const handleDeclineFriend = ({
        notificationId,
    }: {
        notificationId: string;
    }) => {
        if (!socket) return;

        socket.emit('decline-request-add-friend', {
            notificationId,
            senderId: session?.user?.id,
        });

        setNotifications((prev) =>
            prev.filter((notification) => notification._id !== notificationId)
        );
    };

    // Socket
    useEffect(() => {
        if (socket && !loading.friend) {
            socket.on('add-friend-success', (data) => {
                const newFriend = {
                    _id: data._id,
                    name: data.name,
                    image: data.image,
                    isOnline: data.isOnline,
                    lastAccessed: data.lastAccessed,
                };

                if (data) {
                    setFriends((prev) => [...prev, newFriend]);
                }
            });

            socket.on('un-friend-success', (friendId) => {
                if (friendId) {
                    setFriends((prev) =>
                        prev.filter((friend) => friend._id !== friendId)
                    );
                }
            });

            socket.on('friend-online', (userId) => {
                setFriends((prev) => {
                    const friend = prev.find((f) => f._id === userId);
                    if (friend) {
                        friend.isOnline = true;
                    }

                    prev = prev.filter((f) => f._id !== userId);
                    if (friend) {
                        prev.push(friend);
                    }
                    return prev;
                });
            });

            socket.on('user-disconnected', (userId) => {
                setFriends((prev) => {
                    const friend = prev.find((f) => f._id === userId);
                    if (friend) {
                        friend.isOnline = false;
                    }

                    prev = prev.filter((f) => f._id !== userId);
                    if (friend) {
                        prev.push(friend);
                    }
                    return prev;
                });
            });

            socket.on('receive-request-add-friend', (data) => {
                togglePlayingSound();

                setNotifications((prev) => [...prev, data.notification]);
            });
        }
    }, [socket, loading.friend]);

    // Group
    useEffect(() => {
        if (!session?.user?.id) return;

        (async () => {
            const groups = await getGroups();

            if (!groups.success) {
                toast.error(groups.msg);
            } else {
                setGroups(groups.data);
            }
        })();
    }, [session?.user?.id]);

    if (!session) return children;

    const values = {
        friends: friends || [],
        notifications: notifications || [],
        loadingFriends: loading.friend,
        loadingNotifications: loading.notification,

        groups,
        loadingGroups: false,
        setGroups,

        handleAcceptFriend,
        handleDeclineFriend,
    };

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
