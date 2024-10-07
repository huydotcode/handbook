'use client';
import { Button, Icons } from '@/components/ui';
import socketEvent from '@/constants/socketEvent.constant';
import { useSocket } from '@/context';
import { MessageService } from '@/lib/services';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
    currentRoom: IConversation;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

interface IFormData {
    text: string;
}

const InputMessage: React.FC<Props> = ({ currentRoom, setMessages }) => {
    const { data: session } = useSession();
    const { socket } = useSocket();

    const {
        handleSubmit,
        register,
        reset,
        formState: { isSubmitting, isLoading },
    } = useForm<IFormData>();

    const onSubmit = async (data: IFormData) => {
        if (isSubmitting || isLoading) return;

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

        const newMsg = await MessageService.sendMessage({
            roomId: currentRoom._id,
            text,
            userId: session.user.id,
        });

        if (newMsg) {
            setMessages((prev) => [newMsg, ...prev]);
            socket.emit(socketEvent.SEND_MESSAGE, newMsg);
        } else {
            toast.error('Không thể gửi tin nhắn!', {
                id: 'send-message',
            });
        }

        reset();
    };

    return (
        <form
            className="relative mx-4 flex min-w-[500px] max-w-full overflow-hidden rounded-xl border bg-transparent shadow-xl"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <input
                {...register('text')}
                className="flex-1 px-4 py-2"
                type="text"
                placeholder="Nhập tin nhắn..."
                spellCheck={false}
                autoComplete="off"
            />

            <Button
                className="h-full rounded-none border-l px-4 text-base"
                variant={'event'}
                type="submit"
            >
                {isSubmitting ? (
                    <Icons.Loading className="animate-spin" />
                ) : (
                    <Icons.Send />
                )}
            </Button>
        </form>
    );
};
export default InputMessage;
