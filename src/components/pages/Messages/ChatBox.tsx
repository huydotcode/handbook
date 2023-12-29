'use client';
import { Button } from '@/components';
import Avatar from '@/components/Avatar';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { sendMessage } from '@/lib/actions/message.action';
import TimeAgoConverted from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IoClose, IoSend } from 'react-icons/io5';
import Message from './Message';
import { cn } from '@/lib/utils';

interface Props {
    isPopup?: boolean;
    className?: string;
}

interface IFormData {
    text: string;
}

const ChatBox: React.FC<Props> = ({ isPopup, className }) => {
    const {
        currentRoom,
        messages,
        friendsOnline,
        setCurrentRoom,
        messagesInRoom,
    } = useChat();
    const { data: session } = useSession();
    const { socket } = useSocket();
    const { handleSubmit, register, reset } = useForm<IFormData>();

    const userIsOnline = useMemo(() => {
        if (!currentRoom.id) return null;

        return friendsOnline.find(
            (f) =>
                f.userId == currentRoom.id.replace(session?.user.id || '', '')
        );
    }, [friendsOnline, currentRoom.id, session?.user.id]);

    const bottomRef = React.useRef<HTMLDivElement>(null);

    const onSubmit = async (data: IFormData) => {
        if (!session) {
            toast.error('Vui lòng đăng nhập để gửi tin nhắn');
            return;
        }

        if (!socket) {
            toast.error('Không thể gửi tin nhắn! Vui lòng thử lại sau');
            return;
        }

        const { text } = data;

        if (text.trim().length === 0) {
            toast.error('Vui lòng nhập tin nhắn');
            return;
        }

        const newMsg = await sendMessage({
            roomId: currentRoom.id,
            text,
            userId: session.user.id,
        });

        if (newMsg) {
            socket.emit('send-message', newMsg);
        } else {
            toast.error('Không thể gửi tin nhắn!');
        }

        reset();
    };

    useEffect(() => {
        if (messages.length && bottomRef.current && currentRoom.id) {
            bottomRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
    }, [messages.length, bottomRef, currentRoom.id]);

    useEffect(() => {
        if (!socket || !currentRoom.id) return;

        socket.emit('read-message', { roomId: currentRoom.id });
    }, [socket, currentRoom.id]);

    if (!currentRoom || !currentRoom.id) return <></>;

    return (
        <div
            className={cn(
                `relative flex-1 bg-white dark:bg-dark-200 ${className}`,
                {
                    'w-full h-full': !isPopup,
                    'w-[280px] h-[50vh] shadow-2xl rounded-xl bg-white z-50':
                        isPopup,
                }
            )}
        >
            {/* Header */}
            <div
                className={cn('flex items-center justify-between p-4 h-16', {
                    'border-b-2 dark:border-gray-700': !isPopup,
                })}
            >
                <div className="flex items-center">
                    <Avatar imgSrc={currentRoom.image} />
                    <div className="flex flex-col">
                        <h3
                            className={cn('font-bold text-md ml-2', {
                                'text-sm': isPopup,
                            })}
                        >
                            {currentRoom.name}
                        </h3>
                        <span className="text-xs ml-2 text-gray-500">
                            {userIsOnline
                                ? 'Đang hoạt động'
                                : 'Không hoạt động'}
                        </span>
                    </div>

                    {isPopup && (
                        <Button
                            className="absolute top-2 right-2"
                            onClick={() => {
                                setCurrentRoom({} as IRoomChat);
                            }}
                        >
                            <IoClose />
                        </Button>
                    )}
                </div>
            </div>

            {/* Body */}
            <div
                className={cn(
                    'absolute bottom-[52px] w-full h-[calc(100%-56px-64px)] dark:border-y-gray-600 over',
                    {
                        'overflow-y-hidden': isPopup,
                    }
                )}
            >
                <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden p-2">
                    {messagesInRoom.map((msg) => (
                        <Message key={msg._id} data={msg} />
                    ))}

                    <div ref={bottomRef}></div>
                </div>
            </div>

            {/* Footer */}
            <form
                className={cn(
                    'fixed bottom-0 left-0 right-0 w-full flex items-center justify-center p-2 z-50 bg-white dark:bg-dark-200 border-t',
                    {
                        'h-12 absolute w-auto': isPopup,
                    }
                )}
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
            >
                <div className="relative flex items-center w-[80%] max-w-[600px] border shadow-xl rounded-full py-2 px-4 dark:bg-dark-500 dark:text-white">
                    <input
                        {...register('text')}
                        type="text"
                        className="flex-1 outline-none text-sm bg-transparent mr-16"
                        placeholder="Nhập tin nhắn..."
                        spellCheck={false}
                        autoComplete="off"
                    />

                    <Button
                        className="absolute right-0 rounded-r-full w-16 border-l h-full text-base hover:bg-light-100 dark:hover:bg-zinc-600"
                        variant={'custom'}
                        type="submit"
                    >
                        <IoSend />
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default ChatBox;
