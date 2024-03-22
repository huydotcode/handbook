'use client';
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
    isLoading: boolean;
};

export const SocketContext = createContext<SocketContextType>({
    socket: null,
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

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const socketInitializer = useCallback(async () => {
        if (isInitialized || !session?.user) return;

        const socketIO = await ClientIO(SOCKET_API, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            auth: {
                user: session.user,
            },
        });

        setSocket(() => {
            const newSocket = socketIO as any;
            return newSocket;
        });

        setIsLoading(false);
        setIsInitialized(true);

        socketIO.on('connect', () => {
            setIsConnected(true);
        });

        socketIO.on('disconnect', () => {
            setIsConnected(false);
        });

        socketIO.on('connect_error', (err) => {
            setIsConnected(false);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
            setSocket(null);
        };
    }, [socket, session?.user, isInitialized]);

    useEffect(() => {
        if (session?.user) {
            socketInitializer();
        }
    }, [socketInitializer, session?.user]);

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
