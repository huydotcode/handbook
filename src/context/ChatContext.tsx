'use client';
import { Button } from '@/components/ui';
import socketEvent from '@/constants/socketEvent.constant';
import { useSocial, useSocket } from '@/context';
import { MessageService } from '@/lib/services';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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
    const { socket } = useSocket();

    const [currentRoom, setCurrentRoom] = useState<string>('' as string);
    const [messages, setMessages] = useState<IMessageState>({});

    const [lastMessages, setLastMessages] = useState<ILastMessageState>({});
    const [conversationHaveJoined, setConversationHaveJoined] = useState<
        string[]
    >([]);

    const getLastMessage = async (conversationId: string) => {
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
        if (!socket) return;

        conversations.forEach((conversation) => {
            if (conversationHaveJoined.includes(conversation._id)) return;

            // Gán key cho tin nhắn
            setMessages((prev) => ({
                ...prev,
                [conversation._id]: [],
            }));

            socket.emit(socketEvent.JOIN_ROOM, {
                roomId: conversation._id,
            });

            setConversationHaveJoined((prev) => [...prev, conversation._id]);
        });
    }, [socket, conversations]);

    // Lấy ra tin nhắn cuối cùng của mỗi cuộc trò chuyện
    useEffect(() => {
        conversations.forEach((conversation) => {
            if (lastMessages[conversation._id]) return;
            getLastMessage(conversation._id);
        });
    }, [conversations]);

    useEffect(() => {
        if (!socket) return;

        socket.on(socketEvent.RECEIVE_MESSAGE, (message: IMessage) => {
            if (currentRoom === message.conversation) return;
            if (message.sender._id === session?.user?.id) return;
            if (message.conversation == currentRoom) return;

            toast.custom(
                <Button
                    className="p-4"
                    href={`/messages/friends/${message.conversation}`}
                    variant={'primary'}
                >
                    Bạn có tin nhắn mới!
                </Button>,
                {
                    id: message.conversation,
                    position: 'bottom-left',
                    duration: 5000,
                }
            );
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
