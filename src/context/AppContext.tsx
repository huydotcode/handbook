'use client';
import { fetchFriends } from '@/lib/actions/user.action';
import { useSession } from 'next-auth/react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useSocket } from './SocketContext';
import useAsyncSession from '@/hooks/useAsyncSession';

type AppContextType = {
    friends: IFriend[];
    loadingFriends: boolean;
};

const AppContext = createContext<AppContextType | any>({});

export const useAppContext = () => {
    return useContext(AppContext) as AppContextType;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();
    const { socket } = useSocket();
    const [friends, setFriends] = useState<IFriend[]>([]);

    // Fetch friends
    const { loading } = useAsyncSession({
        fn: fetchFriends,
        setState: setFriends,
        agrs: {
            userId: session?.user?.id,
        },
    });

    useEffect(() => {
        if (socket && !loading) {
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
                console.log('user-disconnected', userId);
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
        }
    }, [socket, loading]);

    if (!session) return children;

    const values = {
        friends,
        loadingFriends: loading,
    };

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
