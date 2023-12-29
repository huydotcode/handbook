'use client';
import { fetchFriends } from '@/lib/actions/user.action';
import { signIn, useSession } from 'next-auth/react';
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

    const socketInitializer = useCallback(async () => {
        if (!session || isConnected || socket) {
            return;
        }

        const friends = await fetchFriends({
            userId: session?.user?.id,
        });

        const socketIO = ClientIO(
            process.env.SERVER_API || 'https://handbook-server.onrender.com',
            {
                withCredentials: true,
                extraHeaders: {
                    'my-custom-header': 'abcd',
                },
            }
        );

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
            console.log('Socket connected');
            setIsConnected(true);
        });

        socketIO.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socketIO.on('connect_error', (err) => {
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
            setIsConnected(false);
        });
    }, [session, isConnected, socket]);

    useEffect(() => {
        if (socket && socket.connected) return;
        socketInitializer();
    }, [socketInitializer, socket, session]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
