'use client';
import { Icons } from '@/components/ui';
import { socketConfig } from '@/config/socket';
import socketEvent from '@/constants/socketEvent.constant';
import { useAudio } from '@/hooks';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
        joinRoom: (args: { roomId: string; userId: string }) => void;
        sendMessage: (args: { roomId: string; message: IMessage }) => void;
        receiveNotification: (args: { notification: INotification }) => void;
        deleteMessage: (args: { message: IMessage }) => void;
        pinMessage: (args: { message: IMessage }) => void;
        unpinMessage: (args: { message: IMessage }) => void;
        sendRequestAddFriend: (args: { request: INotification }) => void;
        sendNotification: (args: { notification: INotification }) => void;
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
        sendNotification: () => {},
        readMessage: () => {},
        pinMessage: () => {},
        unpinMessage: () => {},
        likePost: () => {},
        leaveRoom: () => {},
    },
    isConnected: false,
    isLoading: false,
});

export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const {
        queryClientAddMessage,
        queryClientAddPinnedMessage,
        queryClientDeleteMessage,
        queryClientReadMessage,
        queryClientRemovePinnedMessage,
    } = useQueryInvalidation();

    const rawPathname = usePathname();
    const [pathname, setPathname] = useState(rawPathname);
    const { playing, toggle: toggleMessageSound } = useAudio({
        type: 'message',
    });

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // --- Tách các hàm emit ra thành các hằng số riêng ---

    const emitJoinRoom = useCallback(
        (args: { roomId: string; userId: string }) => {
            socket?.emit(socketEvent.JOIN_ROOM, args);
        },
        [socket]
    );

    const emitSendMessage = useCallback(
        (args: { roomId: string; message: IMessage }) => {
            socket?.emit(socketEvent.SEND_MESSAGE, args);
        },
        [socket]
    );

    const emitReceiveNotification = useCallback(
        (args: { notification: INotification }) => {
            socket?.emit(socketEvent.RECEIVE_NOTIFICATION, args);
        },
        [socket]
    );

    const emitDeleteMessage = useCallback(
        (args: { message: IMessage }) => {
            socket?.emit(socketEvent.DELETE_MESSAGE, args);
        },
        [socket]
    );

    const emitSendRequestAddFriend = useCallback(
        (args: { request: INotification }) => {
            socket?.emit(socketEvent.SEND_REQUEST_ADD_FRIEND, args);
        },
        [socket]
    );

    const emitReadMessage = useCallback(
        (args: { roomId: string; userId: string }) => {
            socket?.emit(socketEvent.READ_MESSAGE, args);
        },
        [socket]
    );

    const emitPinMessage = useCallback(
        (args: { message: IMessage }) => {
            socket?.emit(socketEvent.PIN_MESSAGE, args);
        },
        [socket]
    );

    const emitUnpinMessage = useCallback(
        (args: { message: IMessage }) => {
            socket?.emit(socketEvent.UN_PIN_MESSAGE, args);
        },
        [socket]
    );

    const emitLikePost = useCallback(
        (args: { postId: string; authorId: string }) => {
            socket?.emit(socketEvent.LIKE_POST, args);
        },
        [socket]
    );

    const emitLeaveRoom = useCallback(
        (args: { roomId: string; userId: string }) => {
            socket?.emit(socketEvent.LEAVE_ROOM, args);
        },
        [socket]
    );

    const emitSendNotification = useCallback(
        (args: { notification: INotification }) => {
            socket?.emit(socketEvent.SEND_NOTIFICATION, args);
        },
        [socket]
    );

    // Tạo đối tượng socketEmitor bằng useMemo
    const socketEmitor = useMemo(
        () => ({
            joinRoom: emitJoinRoom,
            sendMessage: emitSendMessage,
            receiveNotification: emitReceiveNotification,
            deleteMessage: emitDeleteMessage,
            sendRequestAddFriend: emitSendRequestAddFriend,
            readMessage: emitReadMessage,
            pinMessage: emitPinMessage,
            unpinMessage: emitUnpinMessage,
            likePost: emitLikePost,
            leaveRoom: emitLeaveRoom,
            sendNotification: emitSendNotification,
        }),
        [
            emitJoinRoom,
            emitSendMessage,
            emitReceiveNotification,
            emitDeleteMessage,
            emitSendRequestAddFriend,
            emitReadMessage,
            emitPinMessage,
            emitUnpinMessage,
            emitLikePost,
            emitLeaveRoom,
            emitSendNotification,
        ]
    );

    useEffect(() => {
        if (rawPathname) {
            setPathname(rawPathname);
        }
    }, [rawPathname]);

    const onConnect = () => {
        setIsConnected(true);
    };

    const onDisconnect = () => {
        setIsConnected(false);
    };

    const onConnectError = (err: any) => {
        setIsConnected(false);
        console.error('Socket connection error:', err);
    };

    const onReceiveMessage = useCallback(
        (message: IMessage) => {
            // Bỏ qua tin nhắn do chính user gửi đi
            if (!session?.user || session.user.id === message.sender._id)
                return;

            if (pathname.includes(`/messages/${message.conversation._id}`)) {
                queryClientAddMessage(message);

                socketEmitor.readMessage({
                    roomId: message.conversation._id,
                    userId: session.user.id,
                });
            } else {
                queryClientAddMessage(message);

                // Phát âm thanh thông báo khi nhận được tin nhắn mới
                toggleMessageSound();

                toast(
                    <Link
                        className="flex items-center text-primary-2"
                        href={`/messages/${message.conversation._id}`}
                    >
                        <Icons.Message className="text-3xl" />
                        <p className="ml-2 text-sm text-primary-1">
                            Tin nhắn mới từ{' '}
                            <span className="font-semibold">
                                {message.conversation.group
                                    ? message.conversation.title
                                    : message.sender.name}
                            </span>
                        </p>
                    </Link>,
                    {
                        id: message.conversation._id,
                        position: 'bottom-left',
                    }
                );
            }
        },
        [
            session,
            pathname,
            queryClientAddMessage,
            socketEmitor,
            toggleMessageSound,
        ]
    );

    const onDeleteMessage = useCallback(
        (message: IMessage) => {
            if (
                !session?.user ||
                session.user.id !== message.sender._id ||
                pathname.includes(`/messages/${message.conversation._id}`)
            ) {
                queryClientDeleteMessage(message);
            }
        },
        [session, pathname, queryClientDeleteMessage]
    );

    const onPinMessage = useCallback(
        (message: IMessage) => {
            if (
                !session?.user ||
                session.user.id !== message.sender._id ||
                pathname.includes(`/messages/${message.conversation._id}`)
            ) {
                queryClientAddPinnedMessage(message);
            }
        },
        [session, pathname, queryClientAddPinnedMessage]
    );

    const onUnpinMessage = useCallback(
        (message: IMessage) => {
            if (
                !session?.user ||
                session.user.id !== message.sender._id ||
                pathname.includes(`/messages/${message.conversation._id}`)
            ) {
                queryClientRemovePinnedMessage(message);
            }
        },
        [session, pathname, queryClientRemovePinnedMessage]
    );

    const onReadMessage = useCallback(
        ({ roomId, userId }: { roomId: string; userId: string }) => {
            if (pathname.includes(`/messages/${roomId}`)) {
                queryClientReadMessage(roomId, userId);
            }
        },
        [pathname, queryClientReadMessage]
    );

    // Khởi tạo socket
    useEffect(() => {
        if (!session?.user.id) return;

        const accessToken = localStorage.getItem('accessToken');

        const socketIO = ClientIO(socketConfig.url, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            auth: { user: session.user, accessToken },
        }) as any;

        setSocket(socketIO);
        setIsLoading(false);

        socketIO.on('connect', onConnect);
        socketIO.on('disconnect', onDisconnect);
        socketIO.on('connect_error', onConnectError);

        // Cleanup khi component unmount hoặc session thay đổi
        return () => {
            socketIO.disconnect();
            setSocket(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user.id]); // Thay đổi ở đây

    // Gắn và gỡ các event listener khi socket hoặc các hàm callback thay đổi
    useEffect(() => {
        if (!socket) return;

        socket.on(socketEvent.RECEIVE_MESSAGE, onReceiveMessage);
        socket.on(socketEvent.DELETE_MESSAGE, onDeleteMessage);
        socket.on(socketEvent.PIN_MESSAGE, onPinMessage);
        socket.on(socketEvent.UN_PIN_MESSAGE, onUnpinMessage);
        socket.on(socketEvent.READ_MESSAGE, onReadMessage);

        return () => {
            socket.off(socketEvent.RECEIVE_MESSAGE, onReceiveMessage);
            socket.off(socketEvent.DELETE_MESSAGE, onDeleteMessage);
            socket.off(socketEvent.PIN_MESSAGE, onPinMessage);
            socket.off(socketEvent.UN_PIN_MESSAGE, onUnpinMessage);
            socket.off(socketEvent.READ_MESSAGE, onReadMessage);
        };
    }, [
        socket,
        onReceiveMessage,
        onDeleteMessage,
        onPinMessage,
        onUnpinMessage,
        onReadMessage,
    ]);

    const values: SocketContextType = {
        socket,
        socketEmitor,
        isLoading,
        isConnected,
    };

    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;
