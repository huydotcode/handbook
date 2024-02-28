'use client';
import { Button, Icons } from '@/components/ui';
import { useSocket } from '@/context';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';
import ChatHeader from './ChatHeader';
import InputMessage from './InputMessage';
import MesssageList from './MesssageList';

interface Props {
    isPopup?: boolean;
    className?: string;
    currentRoom: IRoomChat;
}

const ChatBox: React.FC<Props> = ({ isPopup, className, currentRoom }) => {
    const { socket } = useSocket();
    const { messages } = useChat();
    const [scrollDown, setScrollDown] = useState<boolean>(false);
    const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
    const messagesInRoom = useMemo(() => {
        return messages.filter((msg) => msg.roomId === currentRoom.id);
    }, [messages]);
    const bottomRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messages.length && bottomRef.current && currentRoom.id) {
            bottomRef.current?.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }, [messages.length, bottomRef, currentRoom.id]);

    useEffect(() => {
        if (!socket || !currentRoom.id) return;

        socket.emit('read-message', { roomId: currentRoom.id });
    }, [socket, currentRoom.id]);

    useEffect(() => {
        if (scrollDown && bottomRef.current) {
            bottomRef.current?.scrollIntoView({
                behavior: 'smooth',
            });

            setScrollDown(false);
        }
    }, [scrollDown]);

    // Kiểm tra nếu đang ở bottomRef thì không hiển thị nút scroll down
    useEffect(() => {
        if (!bottomRef.current || messagesInRoom.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            setShowScrollDown(!entries[0].isIntersecting);
        });

        observer.observe(bottomRef.current);

        return () => observer.disconnect();
    }, [bottomRef.current]);

    if (!currentRoom || !currentRoom.id) {
        if (isPopup) return null;

        return (
            <div className="flex h-[calc(100vh-56px)] flex-1 items-center justify-center">
                <p className="text-center text-xl text-secondary-1">
                    Hãy chọn một cuộc trò chuyện
                </p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                `relative flex flex-1 flex-col bg-white dark:bg-dark-secondary-1`,
                {
                    'h-full w-full': !isPopup,
                    'z-50 h-[50vh] w-[280px] rounded-xl  shadow-2xl': isPopup,
                },
                { className }
            )}
        >
            <ChatHeader isPopup={isPopup} currentRoom={currentRoom} />

            <div
                className={cn('w-full overflow-y-auto overflow-x-hidden py-2', {
                    'bottom-12 h-[calc(100%-64px-48px)]': isPopup,
                    'h-[calc(100%-56px-64px)]': !isPopup,
                })}
            >
                <div className="flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden">
                    <div ref={bottomRef} />

                    <MesssageList data={messagesInRoom} />
                </div>
            </div>

            <InputMessage currentRoom={currentRoom} isPopup={isPopup} />

            {showScrollDown && (
                <Button
                    className={cn(
                        'z-50 opacity-30 transition-all duration-300 hover:opacity-100',
                        {
                            'fixed bottom-[60px] right-4': !isPopup,
                            'absolute bottom-[60px] right-4 h-8 w-8': isPopup,
                        }
                    )}
                    onClick={() => {
                        setScrollDown(true);
                    }}
                >
                    <Icons.ArrowDown />
                </Button>
            )}
        </div>
    );
};
export default ChatBox;
