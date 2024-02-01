'use client';
import { set } from 'mongoose';
import { useSession } from 'next-auth/react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import toast from 'react-hot-toast';
import { Socket } from 'socket.io';
import { io as ClientIO } from 'socket.io-client';

type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
    isLoading: boolean;
};

const SocketContext = createContext<SocketContextType | null>({
    socket: null,
    isConnected: false,
    isLoading: false,
});

export const useSocket = () => {
    return useContext(SocketContext) as SocketContextType;
};

const SOCKET_API =
    process.env.NODE_ENV == 'production'
        ? 'https://handbook-server.onrender.com'
        : 'http://localhost:5000';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { data: session, status } = useSession();
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const socketInitializer = useCallback(async () => {
        if (isInitialized || !session?.user) return;

        console.log('Socket initializing...');

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
            console.log('Socket connected');
            setIsConnected(true);
        });

        socketIO.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socketIO.on('connect_error', (err) => {
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        });

        return () => {
            console.log('Socket disconnected');
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

    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    );
};
