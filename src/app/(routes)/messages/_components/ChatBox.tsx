'use client';
import { Button, Icons } from '@/components/ui';
import socketEvent from '@/constants/socketEvent.constant';
import { useChat, useSocket } from '@/context';
import { MessageService } from '@/lib/services';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ChatHeader from './ChatHeader';
import InputMessage from './InputMessage';
import Message from './Message';

interface Props {
    className?: string;
    initialMessages: IMessage[];
    conversation: IConversation;
}

const PAGE_SIZE = 20;

const ChatBox: React.FC<Props> = ({
    className,
    initialMessages,
    conversation,
}) => {
    const { socket } = useSocket();
    const { data: session } = useSession();

    const { setCurrentRoom, setLastMessages } = useChat();

    const [messages, setMessages] = useState<IMessage[]>(initialMessages);
    const [page, setPage] = useState<number>(2);

    const { ref: topRef, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    const bottomRef = useRef<HTMLDivElement>(null);
    const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);

    const handleScrollDown = () => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        setCurrentRoom(conversation._id);
    }, [conversation._id]);

    // Lấy tin nhắn
    useEffect(() => {
        (async () => {
            if (!conversation._id || isEnd) return;

            const messages = (await MessageService.getMessages({
                conversationId: conversation._id,
                page,
                pageSize: PAGE_SIZE,
            })) as IMessage[];

            if (messages.length === 0) {
                setIsEnd(true);
                return;
            }

            setMessages((prev) => [...prev, ...messages]);
        })();
    }, [conversation._id, page]);

    // Lắng nghe tin nhắn mới
    useEffect(() => {
        if (!socket || !conversation._id || !session?.user.id) return;

        socket.on(socketEvent.RECEIVE_MESSAGE, (message: IMessage) => {
            setLastMessages((prev) => ({
                ...prev,
                [message.conversation._id]: message,
            }));
            if (message.sender._id === session?.user?.id) return;
            setMessages((prev) => [message, ...prev]);
        });

        socket.on(
            socketEvent.DELETE_MESSAGE,
            ({ prevMsg, msg }: { prevMsg: IMessage; msg: IMessage }) => {
                setMessages((prev) =>
                    prev.filter((item) => item._id !== msg._id)
                );
            }
        );
    }, [socket, conversation._id, session?.user.id]);

    // Kiểm tra nếu đang ở bottomRef thì không hiển thị nút scroll down
    useEffect(() => {
        if (!bottomRef.current || messages.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            setShowScrollDown(!entries[0].isIntersecting);
        });
        observer.observe(bottomRef.current);

        return () => observer.disconnect();
    }, [bottomRef.current]);

    useEffect(() => {
        if (inView && !isEnd) {
            setPage((prev) => prev + 1);
        }
    }, [inView]);

    return (
        <>
            <div
                className={cn(
                    'relative flex h-full flex-1 flex-col rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none',
                    className
                )}
            >
                <ChatHeader currentRoom={conversation} />

                <div className="relative h-[calc(100%-112px)] w-full overflow-y-auto overflow-x-hidden p-2">
                    {session?.user && (
                        <div className="relative flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden border-b px-1 pb-2">
                            <div ref={bottomRef} />

                            {messages
                                .filter(
                                    (msg) =>
                                        msg.conversation._id ===
                                        conversation._id
                                )
                                .map((msg) => (
                                    <Message
                                        key={msg._id}
                                        data={msg}
                                        messagesInRoom={messages}
                                    />
                                ))}

                            {!isEnd && <div ref={topRef} />}
                        </div>
                    )}
                </div>

                <InputMessage
                    currentRoom={conversation}
                    setMessages={setMessages}
                />

                {showScrollDown && (
                    <Button
                        className={cn(
                            'absolute bottom-0 left-1/2 z-50 w-fit -translate-x-1/2 opacity-30 transition-all duration-300 hover:opacity-100'
                        )}
                        onClick={handleScrollDown}
                    >
                        <Icons.ArrowDown className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </>
    );
};

export default ChatBox;
