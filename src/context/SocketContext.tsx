'use client';

import { Icons } from '@/components/ui';
import socketEvent from '@/constants/socketEvent.constant';
import { invalidateMessages } from '@/lib/query';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Socket } from 'socket.io';
import { io as ClientIO } from 'socket.io-client';
import { usePathname } from 'next/navigation';

type SocketContextType = {
    socket: Socket | null;
    socketEmitor: {
        joinRoom: (args: { roomId: string; userId: string }) => void;
        sendMessage: (args: { roomId: string; message: IMessage }) => void;
        receiveNotification: (args: { notification: INotification }) => void;
        deleteMessage: (args: { message: IMessage }) => void;
        pinMessage: (args: { message: IMessage }) => void;
        sendRequestAddFriend: (args: { request: INotification }) => void;
        readMessage: (args: { roomId: string; userId: string }) => void;
        likePost: (args: { postId: string; authorId: string }) => void;
        leaveRoom: (args: { roomId: string; userId: string }) => void;
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
        pinMessage: () => {},
        likePost: () => {},
        leaveRoom: () => {},
    },
    isConnected: false,
    isLoading: false,
});

export const useSocket = () => useContext(SocketContext);

const SOCKET_API =
    process.env.NODE_ENV === 'production'
        ? 'https://handbook-server.onrender.com'
        : 'http://localhost:5000';

function SocketProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const pathname = usePathname();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Tạo các phương thức emit cho socket
    const socketEmitor = useMemo(
        () => ({
            joinRoom: ({
                roomId,
                userId,
            }: {
                roomId: string;
                userId: string;
            }) => {
                socket?.emit(socketEvent.JOIN_ROOM, { roomId, userId });
            },
            sendMessage: ({
                roomId,
                message,
            }: {
                roomId: string;
                message: IMessage;
            }) => {
                socket?.emit(socketEvent.SEND_MESSAGE, { roomId, message });
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
                socket?.emit(socketEvent.DELETE_MESSAGE, { message });
            },
            sendRequestAddFriend: ({ request }: { request: INotification }) => {
                socket?.emit(socketEvent.SEND_REQUEST_ADD_FRIEND, { request });
            },
            readMessage: ({
                roomId,
                userId,
            }: {
                roomId: string;
                userId: string;
            }) => {
                socket?.emit(socketEvent.READ_MESSAGE, { roomId, userId });
            },
            pinMessage: ({ message }: { message: IMessage }) => {
                console.log("socket.emit('pin-message', { message })");
                socket?.emit(socketEvent.PIN_MESSAGE, { message });
            },
            likePost: ({
                postId,
                authorId,
            }: {
                postId: string;
                authorId: string;
            }) => {
                socket?.emit(socketEvent.LIKE_POST, { postId, authorId });
            },
            leaveRoom: ({
                roomId,
                userId,
            }: {
                roomId: string;
                userId: string;
            }) => {
                socket?.emit(socketEvent.LEAVE_ROOM, { roomId, userId });
            },
        }),
        [socket]
    );

    // Khởi tạo socket và gắn các event listener
    useEffect(() => {
        if (!session?.user) return;

        const accessToken = localStorage.getItem('accessToken');

        const socketIO = ClientIO(SOCKET_API, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            auth: { user: session.user, accessToken },
            reconnection: true, // bật chế độ tự reconnect
        }) as any;

        setSocket(socketIO);
        setIsLoading(false);

        socketIO.on('connect', () => {
            setIsConnected(true);
        });

        socketIO.on('disconnect', () => {
            setIsConnected(false);
        });

        socketIO.on('connect_error', (err: any) => {
            setIsConnected(false);
            console.error('Socket connection error:', err);
        });

        socketIO.on(socketEvent.RECEIVE_MESSAGE, (message: IMessage) => {
            // Bỏ qua tin nhắn do chính user gửi đi
            if (session.user.id === message.sender._id) return;

            invalidateMessages(queryClient, message.conversation._id);
            if (pathname.includes(`/messages/${message.conversation._id}`)) {
                socketEmitor.readMessage({
                    roomId: message.conversation._id,
                    userId: session.user.id,
                });
            } else {
                toast(
                    <Link
                        className="flex items-center text-primary-2"
                        href={`/messages/${message.conversation._id}`}
                    >
                        <Icons.Message className="text-3xl" />
                        <p className="ml-2 text-sm text-primary-1">
                            Bạn có tin nhắn mới
                        </p>
                    </Link>,
                    {
                        id: message.conversation._id,
                        position: 'bottom-left',
                    }
                );
            }
        });

        socketIO.on(socketEvent.DELETE_MESSAGE, (message: IMessage) => {
            if (session.user.id !== message.sender._id) {
                invalidateMessages(queryClient, message.conversation._id);
            }
        });

        socketIO.on(socketEvent.PIN_MESSAGE, (message: IMessage) => {
            console.log("socket.on('pin-message', (message) => {");
            invalidateMessages(queryClient, message.conversation._id);
        });

        socketIO.on(
            socketEvent.READ_MESSAGE,
            ({ roomId }: { roomId: string }) => {
                invalidateMessages(queryClient, roomId);
            }
        );

        // Cleanup khi component unmount hoặc session thay đổi
        return () => {
            socketIO.disconnect();
            setSocket(null);
        };
    }, [session?.user]);

    const values: SocketContextType = {
        socket,
        socketEmitor,
        isLoading,
        isConnected,
    };

    if (!session) return <>{children}</>;

    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;
