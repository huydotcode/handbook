'use client';
import { Icons } from '@/components/ui';
import socketEvent from '@/constants/socketEvent.constant';
import { invalidateMessages } from '@/lib/query';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import toast from 'react-hot-toast';
import { Socket } from 'socket.io';
import { io as ClientIO } from 'socket.io-client';

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
        deleteMessage: ({ message }: { message: IMessage }) => void;
        sendRequestAddFriend: ({ request }: { request: INotification }) => void;
        readMessage: ({
            roomId,
            userId,
        }: {
            roomId: string;
            userId: string;
        }) => void;
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
        readMessage: () => {},
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

    const queryClient = useQueryClient();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const socketEmitor = useMemo(() => {
        return {
            joinRoom: ({
                roomId,
                userId,
            }: {
                roomId: string;
                userId: string;
            }) => {
                socket?.emit(socketEvent.JOIN_ROOM, {
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
            deleteMessage: ({ message }: { message: IMessage }) => {
                socket?.emit(socketEvent.DELETE_MESSAGE, {
                    message,
                });
            },
            sendRequestAddFriend: ({ request }: { request: INotification }) => {
                socket?.emit(socketEvent.SEND_REQUEST_ADD_FRIEND, {
                    request,
                });
            },
            readMessage({
                roomId,
                userId,
            }: {
                roomId: string;
                userId: string;
            }) {
                socket?.emit(socketEvent.READ_MESSAGE, {
                    roomId,
                    userId,
                });
            },
        };
    }, [socket]);

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

        socketIO.on(socketEvent.RECEIVE_MESSAGE, (message: IMessage) => {
            if (session.user.id === message.sender._id) return;

            invalidateMessages(queryClient, message.conversation._id);

            const pathName = window.location.pathname;

            // Nếu mà đang trong conversation thì gửi event read message
            if (pathName.includes(`/messages/${message.conversation._id}`)) {
                socketEmitor.readMessage({
                    roomId: message.conversation._id,
                    userId: session.user.id,
                });
            } else {
                toast(
                    <Link
                        className={'flex items-center text-primary-2'}
                        href={`/messages/${message.conversation._id}`}
                    >
                        <Icons.Message className={'text-3xl'} />
                        <p className={'ml-2'}>Bạn có tin nhắn mới</p>
                    </Link>,
                    {
                        id: message.conversation._id,
                        position: 'bottom-left',
                    }
                );
            }
        });

        socketIO.on(socketEvent.DELETE_MESSAGE, (message: IMessage) => {
            if (session.user.id === message.sender._id) return;

            invalidateMessages(queryClient, message.conversation._id);
        });

        socketIO.on('connect_error', (err) => {
            setIsConnected(false);
        });

        socketIO.on(socketEvent.READ_MESSAGE, ({ roomId, userId }) => {
            invalidateMessages(queryClient, roomId);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
            setSocket(null);
        };
    }, [isInitialized, session?.user, queryClient, socketEmitor, socket]);

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
