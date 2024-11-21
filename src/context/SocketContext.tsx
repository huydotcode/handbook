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
import socketEvent from '@/constants/socketEvent.constant';

type SocketContextType = {
    socket: Socket | null;
    socketEmitor: {
        joinRoom: ({
            roomId,
            userId,
        }: {
            roomId: string;
            userId: string;
        }) => void;
        sendMessage: ({
            roomId,
            message,
        }: {
            roomId: string;
            message: IMessage;
        }) => void;
        receiveNotification: ({
            notification,
        }: {
            notification: INotification;
        }) => void;
        deleteMessage: ({
            currentMessage,
            prevMessage,
        }: {
            currentMessage: IMessage;
            prevMessage: IMessage;
        }) => void;
        sendRequestAddFriend: ({ request }: { request: INotification }) => void;
    };

    isConnected: boolean;
    isLoading: boolean;
};

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    socketEmitor: {
        joinRoom: () => {},
        sendMessage: () => {},
        receiveNotification: () => {},
        deleteMessage: () => {},
        sendRequestAddFriend: () => {},
    },
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

        const socketIO = ClientIO(SOCKET_API, {
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

    const socketEmitor = {
        joinRoom: ({ roomId, userId }: { roomId: string; userId: string }) => {
            socket?.emit('join-room', {
                roomId,
                userId,
            });
        },
        sendMessage: ({
            roomId,
            message,
        }: {
            roomId: string;
            message: IMessage;
        }) => {
            socket?.emit(socketEvent.SEND_MESSAGE, {
                roomId,
                message,
            });
        },
        receiveNotification: ({
            notification,
        }: {
            notification: INotification;
        }) => {
            socket?.emit(socketEvent.RECEIVE_NOTIFICATION, {
                notification,
            });
        },
        deleteMessage: ({
            currentMessage,
            prevMessage,
        }: {
            currentMessage: IMessage;
            prevMessage: IMessage;
        }) => {
            socket?.emit(socketEvent.DELETE_MESSAGE, {
                currentMessage,
                prevMessage,
            });
        },
        sendRequestAddFriend: ({ request }: { request: INotification }) => {
            socket?.emit(socketEvent.SEND_REQUEST_ADD_FRIEND, {
                request,
            });
        },
    };

    useEffect(() => {
        if (session?.user) {
            socketInitializer();
        }
    }, [socketInitializer, session?.user]);

    const values = {
        socket,
        socketEmitor,
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
