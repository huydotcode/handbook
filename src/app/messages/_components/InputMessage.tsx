'use client';
import { Button, Icons } from '@/components/ui';
import { useSocket } from '@/context';
import { MessageService } from '@/lib/services';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
interface Props {
    currentRoom: IRoomChat;
    isPopup?: boolean;
}

interface IFormData {
    text: string;
}

const InputMessage: React.FC<Props> = ({ currentRoom, isPopup }) => {
    const { data: session } = useSession();
    const { socket } = useSocket();

    const { handleSubmit, register, reset } = useForm<IFormData>();

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

        const newMsg = await MessageService.sendMessage({
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

    return (
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
    );
};
export default InputMessage;
