'use client';
import { Button, Icons } from '@/components/ui';
import socketEvent from '@/constants/socketEvent.constant';
import { useSocket } from '@/context';
import { MessageService } from '@/lib/services';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
    currentRoom: IPrivateConversation;
    isPopup?: boolean;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

interface IFormData {
    text: string;
}

const InputMessage: React.FC<Props> = ({
    currentRoom,
    isPopup,
    setMessages,
}) => {
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
            className={cn(
                'fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-14 items-center justify-center rounded-t-xl bg-transparent',
                {
                    'absolute h-12 w-auto': isPopup,
                    'w-screen': !isPopup,
                }
            )}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <div className="relative flex w-[80%] max-w-[400px] items-center justify-center overflow-hidden rounded-full border bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none">
                <input
                    {...register('text')}
                    type="text"
                    className="w-[calc(100%-64px)] flex-1  px-4 py-2 text-sm outline-none"
                    placeholder="Nhập tin nhắn..."
                    spellCheck={false}
                    autoComplete="off"
                />

                <Button
                    className="h-full w-12 rounded-r-full border-l text-base"
                    variant={'event'}
                    type="submit"
                >
                    {isSubmitting ? (
                        <Icons.Loading className="animate-spin" />
                    ) : (
                        <Icons.Send />
                    )}
                </Button>
            </div>
        </form>
    );
};
export default InputMessage;
