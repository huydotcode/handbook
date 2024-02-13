'use client';
import { useAudio } from '@/hooks';
import { fetchMessagesByRoomId } from '@/lib/actions/message.action';
import generateRoomId from '@/utils/generateRoomId';
import { useSession } from 'next-auth/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useApp } from '.';
import { useSocket } from './SocketContext';

interface Props {
    children: React.ReactNode;
}

interface IChatContext {
    friends: IFriend[];
    currentRoom: IRoomChat;
    setCurrentRoom: React.Dispatch<React.SetStateAction<IRoomChat>>;
    messages: IMessage[];
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    lastMessages: IMessage[];
    setLastMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    loading: ILoading;
    rooms: IRoomChat[];
    setRooms: React.Dispatch<React.SetStateAction<IRoomChat[]>>;
    conversations: IRoomChat[];
    setConversations: React.Dispatch<React.SetStateAction<IRoomChat[]>>;
}

const ChatContext = React.createContext<IChatContext>({} as IChatContext);

export const useChat = () => {
    const context = useContext(ChatContext);
    return context as IChatContext;
};

const ChatProvider: React.FC<Props> = ({ children }) => {
    //* Context
    const { data: session } = useSession();
    const { socket } = useSocket();
    const { friends } = useApp();
    const { toggle } = useAudio({ type: 'message' });

    //* State
    const [rooms, setRooms] = useState<IRoomChat[]>([]);
    const [conversations, setConversations] = useState<IRoomChat[]>([]);
    const [currentRoom, setCurrentRoom] = useState<IRoomChat>({} as IRoomChat);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [roomsHaveGetMessages, setRoomsHaveGetMessages] = useState<string[]>(
        []
    );
    const [roomsHaveJoin, setRoomsHaveJoin] = useState<string[]>([]);

    const [loading, setLoading] = useState<ILoading>({
        friends: false,
        messages: false,
    });
    const [lastMessages, setLastMessages] = useState<IMessage[]>([]);

    // Callback
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
                        if (!data || !roomId) return;

                        setLastMessages((prev) => {
                            const index = prev.findIndex(
                                (msg) => msg.roomId === roomId
                            );
                            if (index !== -1) {
                                prev[index] = data;
                                return [...prev];
                            }
                            return [...prev, data];
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

    // Tham gia vào phòng là bạn bè
    useEffect(() => {
        if (!socket || !session) return;

        (async () => {
            for (const friend of friends) {
                const roomId = generateRoomId(friend._id, session.user.id);

                if (roomsHaveJoin.includes(roomId)) continue;

                socket.emit('join-room', {
                    roomId,
                });

                socket.emit('get-last-messages', {
                    roomId,
                });

                setRoomsHaveJoin((prev) => [...prev, roomId]);
            }
        })();
    }, [socket, session?.user.id, friends]);

    // Tham gia vào phòng không phải bạn bè
    useEffect(() => {
        if (!socket || !session) return;
        if (
            currentRoom.id &&
            !roomsHaveJoin.includes(currentRoom.id) &&
            currentRoom.type == 'r'
        ) {
            const roomId = currentRoom.id;
            const otherUserId = roomId.replace(session.user.id, '');
            const isFriend = friends.find(
                (friend: IFriend) => friend._id === otherUserId
            );

            // Kiểm tra nếu không phải friend thì join vào room
            if (!isFriend) {
                socket.emit('join-room', {
                    roomId,
                });

                setRoomsHaveJoin((prev) => [...prev, roomId]);
            }
        }
    }, [currentRoom.id]);

    // Đánh dấu đã đọc tin nhắn
    useEffect(() => {
        if (socket && currentRoom.id) {
            socket.emit('read-message', {
                roomId: currentRoom.id,
            });
        }
    }, [currentRoom.id]);

    // Socket
    useEffect(() => {
        handleSocketAction('RECEIVE_MESSAGE');
        handleSocketAction('GET_LAST_MESSAGES');
        handleSocketAction('READ_MESSAGE');
        handleSocketAction('DELETE_MESSAGE');
        handleSocketAction('RECEIVE_MESSAGES_FROM_UNKNOWN_USER');
    }, [handleSocketAction]);

    // Lấy tin nhắn
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
        setLastMessages,
        loading,
        rooms,
        setRooms,
        conversations,
        setConversations,
    };
    return (
        <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
    );
};
export default ChatProvider;
