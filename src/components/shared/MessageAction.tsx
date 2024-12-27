'use client';
import { Button } from '@/components/ui';
import { useSocket } from '@/context';
import { ConversationService } from '@/lib/services';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

interface Props {
    className?: string;
    messageTo: string;
}

const MessageAction = ({ className, messageTo }: Props) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { socketEmitor } = useSocket();

    const handleClick = async () => {
        if (!session) return;

        const { isNew, conversation } =
            await ConversationService.getConversationWithTwoUsers({
                userId: session?.user?.id,
                otherUserId: messageTo,
            });

        if (!conversation) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            return;
        }

        if (isNew) {
            socketEmitor.joinRoom({
                roomId: conversation._id,
                userId: session.user.id,
            });

            socketEmitor.joinRoom({
                roomId: conversation._id,
                userId: messageTo,
            });
        }

        router.push(`/messages/${conversation._id}`);
    };

    return (
        <Button className={className} onClick={handleClick} variant={'primary'}>
            Nhắn tin
        </Button>
    );
};

export default MessageAction;
