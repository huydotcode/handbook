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

interface Props {
    children: React.ReactNode;
}

interface IChatContext {
    friends: IFriend[];
    friendsOnline: any[];
    currentRoom: IRoomChat;
    setCurrentRoom: React.Dispatch<React.SetStateAction<IRoomChat>>;
    messages: IMessage[];
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    lastMessages: ILastMessage[];
    setLastMessages: React.Dispatch<React.SetStateAction<ILastMessage[]>>;
    messagesInRoom: IMessage[];
    loading: ILoading;
}

interface ISocketUser {
    socketId: string;
    userId: string;
    name: string;
    image: string;
}

const ChatContext = React.createContext<IChatContext>({} as IChatContext);

export const useChat = () => {
    return useContext(ChatContext) as IChatContext;
};

const ChatProvider: React.FC<Props> = ({ children }) => {
    const { socket } = useSocket();
    const { data: session } = useSession();
    const [friends, setFriends] = useState<IFriend[]>([]);
    const [friendsOnline, setFriendsOnline] = useState<ISocketUser[]>([]);
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

    const handleGetFriends = useCallback(async () => {
        if (!session) return;
        setLoading((prev) => ({ ...prev, friends: true }));
        const data =
            (await fetchFriends({
                userId: session.user.id,
            })) || [];

        setFriends(data);
    }, [session]);

    const handleEmitFriends = useCallback(() => {
        if (socket?.connected) {
            socket.emit('users', friends);
        }
    }, [socket, friends]);

    const handleFriendsOnline = useCallback(() => {
        if (!socket) return;

        socket.on('users', (users) => {
            const newUsers = [] as any;
            users.forEach((user: any) => {
                const isIncluded =
                    friends.includes(user.userId) &&
                    !friendsOnline.includes(user.userId);
                if (!isIncluded) {
                    newUsers.push(user);
                }
            });

            setFriendsOnline(newUsers);
        });
    }, [socket, friends, friendsOnline]);

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
                case 'ADD_FRIEND':
                    socket.on('add-friend-success', (data) => {
                        const newFriend = {
                            _id: data._id,
                            name: data.name,
                            image: data.image,
                        };

                        if (data) {
                            setFriends((prev) => [...prev, newFriend]);
                        }
                    });
                    break;
                case 'UN_FRIEND':
                    socket.on('un-friend-success', (friendId) => {
                        if (friendId) {
                            setFriends((prev) =>
                                prev.filter((friend) => friend._id !== friendId)
                            );
                        }
                    });
                    break;
                default:
                    break;
            }
        },
        [socket]
    );

    // Fetch friends
    useEffect(() => {
        handleGetFriends();
    }, [handleGetFriends]);

    // Emit friends to socket
    useEffect(() => {
        // handleEmitFriends();
    }, [handleEmitFriends]);

    // Listen to friends online
    useEffect(() => {
        handleFriendsOnline();
    }, [handleFriendsOnline]);

    useEffect(() => {
        handleSocketAction('RECEIVE_MESSAGE');
        handleSocketAction('GET_LAST_MESSAGES');
        handleSocketAction('READ_MESSAGE');
        handleSocketAction('DELETE_MESSAGE');
        handleSocketAction('ADD_FRIEND');
        handleSocketAction('UN_FRIEND');
    }, [handleSocketAction]);

    // Get messages
    useEffect(() => {
        handleGetMessages();
    }, [handleGetMessages]);

    const values = {
        friends: friends,
        friendsOnline: friendsOnline,
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
