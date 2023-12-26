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
import { Socket } from 'socket.io';
import { io as ClientIO } from 'socket.io-client';

type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | null>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext) as SocketContextType;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { data: session } = useSession();
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const socketInitializer = useCallback(async () => {
        if (!session || isConnected || isInitialized || socket?.connected)
            return;
        setIsInitialized(true);

        const friends = await fetchFriends({
            userId: session?.user?.id,
        });

        await fetch('/api/socket');
        const socketIO = ClientIO();
        setSocket((prev) => {
            const newSocket = socketIO as any;
            return newSocket;
        });

        socketIO.auth = {
            user: {
                ...session?.user,
                friends,
            },
        };

        socketIO.on('connect', () => {
            setIsConnected(true);
        });

        socketIO.on('disconnect', () => {
            setIsConnected(false);
        });
    }, [session, isConnected, isInitialized, socket?.connected]);

    useEffect(() => {
        if (socket?.connected) return;
        socketInitializer();
    }, [socketInitializer, socket?.connected]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
