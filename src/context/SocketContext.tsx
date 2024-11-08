'use client';
import { useSession } from 'next-auth/react';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { socket } from '@/lib/socket';

type SocketContextType = {
    isConnected: boolean;
    isLoading: boolean;
};

export const SocketContext = createContext<SocketContextType>({
    isConnected: false,
    isLoading: false,
});

export const useSocket = () => useContext(SocketContext);

const SOCKET_API =
    process.env.NODE_ENV == 'production'
        ? 'https://handbook-server.onrender.com'
        : 'http://localhost:5000';

function SocketProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const socketInitializer = useCallback(() => {
        console.log('Initializing socket');
        if (isInitialized || !session?.user) return;

        setIsLoading(false);
        setIsInitialized(true);

        socket.on('connect', () => {
            console.log('Connected to socket');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected to socket');
            setIsConnected(false);
        });

        socket.on('connect_error', (err) => {
            setIsConnected(false);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket, session?.user, isInitialized]);

    useEffect(() => {
        if (!session) return;

        (async () => {
            try {
                socket.connect();
            } catch (error) {}
        })();

        return () => {
            socket.disconnect();
        };
    }, []);

    const values = {
        socket,
        isLoading,
        isConnected,
    };

    if (!session) return children;

    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;
