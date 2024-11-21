'use client';
import socketEvent from '@/constants/socketEvent.constant';
import { useSocial, useSocket } from '@/context';
import { MessageService } from '@/lib/services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

/*
    * ChatContext
    1. Lấy ra các cuộc trò chuyện
    2. Lấy ra tin nhắn cuối cùng của mỗi cuộc trò chuyện
    3. Lấy ra thông báo mới nhất
    4. Lấy ra thông báo chưa đọc
    5. Lấy ra thông báo chưa đọc của từng cuộc trò chuyện
*/

interface IMessageState {
    [key: string]: IMessage[];
}

interface ILastMessageState {
    [key: string]: IMessage;
}

interface IChatContext {
    messages: IMessageState;
    setMessages: React.Dispatch<React.SetStateAction<IMessageState>>;

    lastMessages: ILastMessageState;
    setLastMessages: React.Dispatch<React.SetStateAction<ILastMessageState>>;

    currentRoom: string;
    setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
}

export const ChatContext = React.createContext<IChatContext>({
    messages: {},
    setMessages: () => {},

    lastMessages: {},
    setLastMessages: () => {},

    currentRoom: '',
    setCurrentRoom: () => {},
});

export const useChat = () => React.useContext(ChatContext);

function ChatProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { conversations } = useSocial();
    const { socket, socketEmitor } = useSocket();

    const [currentRoom, setCurrentRoom] = useState<string>('' as string);
    const [messages, setMessages] = useState<IMessageState>({});

    const [lastMessages, setLastMessages] = useState<ILastMessageState>({});

    const getLastMessage = async ({
        conversationId,
    }: {
        conversationId: string;
    }) => {
        console.log('ChatContext: getLastMessage');
        const lastMessage = await MessageService.getLastMessage({
            conversationId: conversationId,
        });

        if (lastMessage) {
            setLastMessages((prev) => ({
                ...prev,
                [conversationId]: lastMessage,
            }));
        }
    };

    // Tham gia các cuộc trò chuyện
    useEffect(() => {
        conversations.forEach((conversation) => {
            setMessages((prev) => ({
                ...prev,
                [conversation._id]: [],
            }));

            socketEmitor.joinRoom({
                roomId: conversation._id,
                userId: session?.user?.id || '',
            });
        });
    }, [socket, conversations]);

    // Lấy ra tin nhắn cuối cùng của mỗi cuộc trò chuyện
    useEffect(() => {
        conversations.forEach((conversation) => {
            if (lastMessages[conversation._id]) return;
            getLastMessage({
                conversationId: conversation._id,
            });
        });
    }, [conversations]);

    useEffect(() => {
        if (!socket || !session?.user?.id) return;

        socket.on(socketEvent.RECEIVE_MESSAGE, (message: IMessage) => {
            if (currentRoom === message.conversation._id) return;
            if (message.sender._id === session?.user?.id) return;
            if (message.conversation._id == currentRoom) return;

            setLastMessages((prev) => ({
                ...prev,
                [message.conversation._id]: message,
            }));

            setMessages((prev) => ({
                ...prev,
                [message.conversation._id]: [
                    message,
                    ...(prev[message.conversation._id] || []),
                ],
            }));
        });
    }, [socket, session?.user.id]);

    const values = {
        messages,
        setMessages,

        lastMessages,
        setLastMessages,

        currentRoom,
        setCurrentRoom,
    } as IChatContext;

    if (!session) return children;

    return (
        <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
    );
}

export default ChatProvider;
