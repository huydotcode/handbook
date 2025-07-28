'use client';
import { ConfirmModal, Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { PopoverContent } from '@/components/ui/Popover';
import { useSocket } from '@/context';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import ConversationService from '@/lib/services/conversation.service';
import MessageService from '@/lib/services/message.service';
import { useSession } from 'next-auth/react';
import { FormEventHandler, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    msg: IMessage;
    messages: IMessage[];
    index: number;
}

const MessageAction = ({ msg, index, messages }: Props) => {
    const { data: session } = useSession();
    const { socket, socketEmitor } = useSocket();
    const [openModalCofirm, setOpenModalConfirm] = useState<boolean>(false);
    const {
        queryClientAddPinnedMessage,
        queryClientDeleteMessage,
        queryClientRemovePinnedMessage,
    } = useQueryInvalidation();

    const isOwnMsg = msg.sender._id === session?.user.id;
    const pinnedMessages = useMemo(() => {
        return messages.filter((msg) => msg.isPin);
    }, [messages]);

    // Xử lý ghim tin nhắn
    const handlePinMessage = async () => {
        if (pinnedMessages.length >= 5) {
            toast.error('Không thể ghim quá 5 tin nhắn!', {
                id: 'pin-message',
            });
            return;
        }

        try {
            if (!socket || msg.isPin) return;

            await ConversationService.addPinMessage({
                messageId: msg._id,
                conversationId: msg.conversation._id,
            });

            toast.success('Đã ghim tin nhắn!', { id: 'pin-message' });

            queryClientAddPinnedMessage(msg);

            socketEmitor.pinMessage({
                message: msg,
            });
        } catch (error) {
            console.log(error);
            toast.error('Đã có lỗi xảy ra!', { id: 'pin-message' });
        }
    };

    // Xử lý hủy ghim tin nhắn
    const handleUnPinMessage = async () => {
        try {
            if (!socket || !msg.isPin) return;

            await ConversationService.removePinMessage({
                messageId: msg._id,
                conversationId: msg.conversation._id,
            });

            toast.success('Đã hủy ghim tin nhắn!', { id: 'unpin-message' });

            queryClientRemovePinnedMessage(msg);

            socketEmitor.unpinMessage({
                message: msg,
            });
        } catch (error) {
            toast.error('Đã có lỗi xảy ra!', { id: 'unpin-message' });
        }
    };

    // Xử lý xóa tin nhắn
    const handleDeleteMsg: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            if (!socket) return;

            console.log({
                index,
                messsage: messages[index + 1],
                prevMessageId: messages[index + 1]
                    ? messages[index + 1]._id
                    : null,
            });

            await MessageService.delete({
                messageId: msg._id,
                conversationId: msg.conversation._id,
                prevMessageId: messages[index + 1]
                    ? messages[index + 1]._id
                    : null,
            });

            if (msg.isPin) {
                await ConversationService.removePinMessage({
                    messageId: msg._id,
                    conversationId: msg.conversation._id,
                });
            }

            toast.success('Đã xóa tin nhắn!', { id: 'delete-message' });

            queryClientDeleteMessage(msg);

            socketEmitor.deleteMessage({
                message: msg,
            });
        } catch (error) {
            toast.error('Đã có lỗi xảy ra!', { id: 'delete-message' });
        }
    };

    return (
        <>
            <PopoverContent
                className={'p-1'}
                side={isOwnMsg ? 'left' : 'right'}
                asChild
            >
                <div className={'flex max-w-[150px] flex-col items-center'}>
                    <Button
                        className={'w-full justify-start rounded-none'}
                        variant={'ghost'}
                        onClick={() => setOpenModalConfirm(true)}
                        size={'xs'}
                    >
                        <Icons.Delete className={'h-4 w-4'} /> Xóa tin nhắn
                    </Button>

                    <Button
                        className={'w-full justify-start rounded-none'}
                        variant={'ghost'}
                        onClick={() => {
                            if (msg.isPin) {
                                handleUnPinMessage();
                            } else {
                                handlePinMessage();
                            }
                        }}
                        size={'xs'}
                    >
                        <Icons.Pin className={'h-4 w-4'} />{' '}
                        {msg.isPin ? 'Hủy ghim' : 'Ghim tin nhắn'}
                    </Button>

                    <ConfirmModal
                        open={openModalCofirm}
                        setShow={setOpenModalConfirm}
                        onClose={() => setOpenModalConfirm(false)}
                        onConfirm={handleDeleteMsg}
                        title="Xóa tin nhắn"
                        message="Bạn có chắc chắn muốn xóa tin nhắn này không?"
                        confirmText="Xóa"
                        cancelText="Hủy"
                    />
                </div>
            </PopoverContent>
        </>
    );
};

export default MessageAction;
