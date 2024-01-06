'use client';
import { fetchMessagesByRoomId } from '@/lib/actions/message.action';
import { fetchFriends } from '@/lib/actions/user.action';
import { useSession } from 'next-auth/react';
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useSocket } from './SocketContext';
import { useAppContext } from './AppContext';

interface Props {
    children: React.ReactNode;
}

interface IChatContext {
    friends: IFriend[];
    currentRoom: IRoomChat;
    setCurrentRoom: React.Dispatch<React.SetStateAction<IRoomChat>>;
    messages: IMessage[];
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    lastMessages: ILastMessage[];
    setLastMessages: React.Dispatch<React.SetStateAction<ILastMessage[]>>;
    messagesInRoom: IMessage[];
    loading: ILoading;
}

const ChatContext = React.createContext<IChatContext>({} as IChatContext);

export const useChat = () => {
    return useContext(ChatContext) as IChatContext;
};

const ChatProvider: React.FC<Props> = ({ children }) => {
    const { socket } = useSocket();
    const { friends } = useAppContext();
    const [messages, setMessages] = useState<IMessage[]>([]);

    const [currentRoom, setCurrentRoom] = useState<IRoomChat>({} as IRoomChat);
    const [roomsHaveGetMessages, setRoomsHaveGetMessages] = useState<string[]>(
        []
    );
    const [loading, setLoading] = useState<ILoading>({
        friends: false,
        messages: false,
    });
    const [lastMessages, setLastMessages] = useState<ILastMessage[]>([]);

    const messagesInRoom = useMemo(() => {
        return messages.filter((msg) => msg.roomId === currentRoom.id);
    }, [messages, currentRoom.id]);

    const handleGetMessages = useCallback(() => {
        if (
            !currentRoom ||
            !currentRoom.id ||
            roomsHaveGetMessages.includes(currentRoom.id)
        )
            return;

        const fetchMessages = async () => {
            const data = await fetchMessagesByRoomId({
                roomId: currentRoom.id,
            });

            if (data) {
                setMessages((prev) => [...prev, ...data]);
            }

            setRoomsHaveGetMessages((prev) => [...prev, currentRoom.id]);
        };

        fetchMessages();
    }, [currentRoom, roomsHaveGetMessages]);

    const handleSocketAction = useCallback(
        (action: string) => {
            if (!socket) return;

            switch (action) {
                case 'RECEIVE_MESSAGE':
                    socket.on('receive-message', (data: any) => {
                        setMessages((prev) => [data, ...prev]);
                    });
                    break;
                case 'DELETE_MESSAGE':
                    socket.on('delete-message', (message) => {
                        setMessages((prev) =>
                            prev.filter((msg) => msg._id !== message._id)
                        );
                    });
                    break;
                case 'GET_LAST_MESSAGES':
                    socket.on('get-last-messages', ({ roomId, data }) => {
                        setLastMessages((prev) => {
                            const index = prev.findIndex(
                                (msg) => msg.roomId === roomId
                            );
                            if (index !== -1) {
                                prev[index] = {
                                    roomId: roomId,
                                    data: data,
                                };
                            } else {
                                prev.push({
                                    roomId: roomId,
                                    data: data,
                                });
                            }
                            return prev;
                        });
                    });
                    break;
                case 'READ_MESSAGE':
                    socket.on('read-message', ({ roomId, userId }) => {
                        setMessages((prev) =>
                            prev.map((msg) => {
                                if (
                                    msg.roomId === roomId &&
                                    msg.userId !== userId
                                ) {
                                    return {
                                        ...msg,
                                        isRead: true,
                                    };
                                }
                                return msg;
                            })
                        );
                    });
                    break;
                default:
                    break;
            }
        },
        [socket]
    );

    useEffect(() => {
        handleSocketAction('RECEIVE_MESSAGE');
        handleSocketAction('GET_LAST_MESSAGES');
        handleSocketAction('READ_MESSAGE');
        handleSocketAction('DELETE_MESSAGE');
    }, [handleSocketAction]);

    // Get messages
    useEffect(() => {
        handleGetMessages();
    }, [handleGetMessages]);

    const values = {
        friends: friends,
        currentRoom: currentRoom,
        setCurrentRoom: setCurrentRoom,
        messages,
        setMessages,
        lastMessages,
        messagesInRoom,
        setLastMessages,
        loading,
    };
    return (
        <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
    );
};
export default ChatProvider;
