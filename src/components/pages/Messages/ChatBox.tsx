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
import { IoSend } from 'react-icons/io5';
import Message from './Message';

interface Props {}

interface IFormData {
    text: string;
}

const ChatBox: React.FC<Props> = ({}) => {
    const { currentRoom, messages, friendsOnline } = useChat();
    const { data: session } = useSession();
    const { socket } = useSocket();
    const { handleSubmit, register, reset } = useForm<IFormData>();

    const messagesInRoom = useMemo(() => {
        return messages.filter((msg) => msg.roomId === currentRoom.id);
    }, [messages, currentRoom.id]);

    const userIsOnline = useMemo(() => {
        if (!currentRoom.id) return null;

        return friendsOnline.find(
            (f) =>
                f.userId == currentRoom.id.replace(session?.user.id || '', '')
        );
    }, [friendsOnline, currentRoom.id, session?.user.id]);

    const bottomRef = React.useRef<HTMLDivElement>(null);

    const onSubmit = async (data: IFormData) => {
        if (!session || !socket) return;

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
        if (messages.length) {
            bottomRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
    }, [messages.length]);

    useEffect(() => {
        if (!socket || !currentRoom.id) return;

        console.log('EMIT READ MESSAGE');
        socket.emit('read-message', { roomId: currentRoom.id });
    }, [socket, currentRoom.id]);

    if (!currentRoom || !currentRoom.id)
        return (
            <div className="flex flex-1 items-center justify-center">
                Chưa có cuộc trò chuyện nào
            </div>
        );

    return (
        <div className="relative flex-1 flex flex-col bg-white dark:bg-dark-200 ">
            {/* Header */}
            <div className="flex items-center justify-between p-4 h-16">
                <div className="flex items-center">
                    <Avatar imgSrc={currentRoom.image} />
                    <div className="flex flex-col">
                        <h3 className="font-bold text-lg ml-2">
                            {currentRoom.name}
                        </h3>
                        <span className="text-xs ml-2 text-gray-500">
                            {userIsOnline
                                ? 'Đang hoạt động'
                                : 'Không hoạt động'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="w-full h-[calc(100%-56px-64px)] p-2 border-y dark:border-y-gray-600 over">
                <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden p-2">
                    {messagesInRoom.map((msg) => (
                        <Message key={msg._id} data={msg} />
                    ))}

                    <div ref={bottomRef}></div>
                </div>
            </div>

            {/* Footer */}
            <form
                className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-2"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
            >
                <input
                    {...register('text')}
                    type="text"
                    className="w-[80%] outline-none border-2 shadow-xl border-gray-300 rounded-full py-2 px-4 max-w-[600px]"
                    placeholder="Nhập tin nhắn..."
                    spellCheck={false}
                    autoComplete="off"
                />

                <Button type="submit">
                    <IoSend />
                </Button>
            </form>
        </div>
    );
};
export default ChatBox;
