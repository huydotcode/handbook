'use client';
import { Button, Icons } from '@/components/ui';
import { useApp, useSocket } from '@/context';
import { sendMessage } from '@/lib/actions/message.action';
import { cn } from '@/lib/utils';
import TimeAgoConverted from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Message } from '.';
import { useChat } from '@/context/ChatContext';

interface Props {
    isPopup?: boolean;
    className?: string;
    currentRoom: IRoomChat;
}

interface IFormData {
    text: string;
}

const ChatBox: React.FC<Props> = ({ isPopup, className, currentRoom }) => {
    const { data: session } = useSession();
    const { socket } = useSocket();
    const { friends } = useApp();
    const { messages, setCurrentRoom, setRooms } = useChat();
    const { handleSubmit, register, reset } = useForm<IFormData>();

    const [scrollDown, setScrollDown] = useState<boolean>(false);
    const [showScrollDown, setShowScrollDown] = useState<boolean>(false);

    const messagesInRoom = useMemo(() => {
        return messages.filter((msg) => msg.roomId === currentRoom.id);
    }, [messages]);

    const userIsOnline = useMemo(() => {
        if (!currentRoom.id) return null;

        const friend = friends.find(
            (f) => f._id === currentRoom.id.replace(session?.user?.id || '', '')
        );

        return friend?.isOnline || false;
    }, [friends, session?.user?.id, currentRoom.id]);

    const bottomRef = React.useRef<HTMLDivElement>(null);

    const onSubmit = async (data: IFormData) => {
        if (!session) {
            toast.error('Vui lòng đăng nhập để gửi tin nhắn', {
                id: 'login-to-send-message',
            });
            return;
        }

        if (!socket) {
            toast.error('Không thể gửi tin nhắn! Vui lòng thử lại sau', {
                id: 'login-to-send-message',
            });
            return;
        }

        const { text } = data;

        if (text.trim().length === 0) {
            toast.error('Vui lòng nhập tin nhắn', {
                id: 'text-is-required',
            });
            return;
        }

        const newMsg = await sendMessage({
            roomId: currentRoom.id,
            text,
            userId: session.user.id,
        });

        if (newMsg) {
            socket.emit('send-message', newMsg);
            socket.emit('get-last-messages', { roomId: currentRoom.id });
        } else {
            toast.error('Không thể gửi tin nhắn!', {
                id: 'send-message',
            });
        }

        reset();
    };

    const scrollDownFn = () => {
        if (bottomRef.current) {
            bottomRef.current?.scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

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
            <div className="flex h-16 items-center justify-between border-b-2 p-4 dark:border-dark-secondary-2">
                <div className="flex items-center">
                    <Image
                        className="rounded-full"
                        alt={currentRoom.name}
                        src={currentRoom.image}
                        width={32}
                        height={32}
                    />
                    <div className="flex flex-col">
                        <h3
                            className={cn('text-md ml-2 font-bold', {
                                'text-sm': isPopup,
                            })}
                        >
                            {currentRoom.name}
                        </h3>
                        <span className="ml-2 text-xs ">
                            {userIsOnline ? (
                                'Đang hoạt động'
                            ) : (
                                <TimeAgoConverted
                                    time={currentRoom.lastAccessed}
                                    className="text-xs "
                                    textBefore="Hoạt động "
                                    textAfter=" trước"
                                />
                            )}
                        </span>
                    </div>

                    {isPopup && (
                        <Button
                            className="absolute right-2 top-2"
                            size={'medium'}
                            onClick={() => {
                                setRooms((prev) => {
                                    const index = prev.findIndex(
                                        (room) => room.id === currentRoom.id
                                    );
                                    if (index !== -1) {
                                        prev.splice(index, 1);
                                    }
                                    return prev;
                                });
                                setCurrentRoom({} as IRoomChat);
                            }}
                        >
                            <Icons.Close />
                        </Button>
                    )}
                </div>
            </div>

            <div
                className={cn('w-full overflow-y-auto overflow-x-hidden py-2', {
                    'bottom-12 h-[calc(100%-64px-48px)]': isPopup,
                    'h-[calc(100%-56px-64px)] md:fixed md:bottom-14 md:left-0 md:right-0 md:pt-16':
                        !isPopup,
                })}
            >
                <div className="flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden">
                    <div ref={bottomRef} />

                    {messagesInRoom.map((msg) => (
                        <Message
                            key={msg._id}
                            data={msg}
                            messagesInRoom={messagesInRoom}
                        />
                    ))}
                </div>
            </div>

            <form
                className={cn(
                    'fixed bottom-0 left-0 right-0 z-50 flex h-14 w-full items-center justify-center border-t p-2 dark:border-dark-secondary-2',
                    {
                        'absolute h-12 w-auto': isPopup,
                    }
                )}
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
            >
                <div className="relative flex w-[80%] max-w-[600px] items-center justify-center overflow-hidden rounded-full border bg-white shadow-xl dark:bg-dark-secondary-1">
                    <input
                        {...register('text')}
                        type="text"
                        className="w-[calc(100%-64px)] flex-1  px-4 py-2 text-sm outline-none"
                        placeholder="Nhập tin nhắn..."
                        spellCheck={false}
                        autoComplete="off"
                        onFocus={scrollDownFn}
                    />

                    <Button
                        className="h-full w-12 rounded-r-full border-l text-base"
                        variant={'event'}
                        type="submit"
                    >
                        <Icons.Send />
                    </Button>
                </div>
            </form>

            {showScrollDown && (
                <Button
                    className={cn(
                        '  z-50 opacity-30 transition-all duration-300 hover:opacity-100',
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
