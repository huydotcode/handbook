'use client';
import { Button } from '@/components/ui';
import Icons from '@/components/ui/Icons';
import { useApp } from '@/context';

import { useSocket } from '@/context/SocketContext';
import React, { FormEventHandler, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    userId: string;
}

const Action: React.FC<Props> = ({ userId }) => {
    const { friends } = useApp();
    const { socket } = useSocket();

    const isFriend = friends && friends.find((friend) => friend._id === userId);
    const [isRequest, setIsRequest] = useState<boolean>(false);

    const handleAddFriend: FormEventHandler = async (e) => {
        if (isRequest) return;

        e.preventDefault();

        if (socket) {
            await socket.emit('send-request-add-friend', {
                receiverId: userId,
            });

            setIsRequest(true);

            toast.success('Đã gửi lời mời kết bạn');
        }
    };

    const handleRemoveFriend = async () => {
        if (socket) {
            await socket.emit('un-friend', {
                friendId: userId,
            });

            setIsRequest(false);
            toast.success('Đã hủy kết bạn');
        }
    };

    useEffect(() => {
        if (isFriend) {
            setIsRequest(false);
        }
    }, [isFriend]);

    return (
        <div className="flex items-center">
            <Button
                className={`mr-2 h-12 min-w-[48px]`}
                variant={'primary'}
                size={'medium'}
                href={
                    isFriend ? `/messages/f/${userId}` : `/messages/r/${userId}`
                }
            >
                <span>
                    <Icons.Message />
                </span>

                <p className="ml-2 md:hidden">Nhắn tin</p>
            </Button>

            <Button
                className={'h-12 min-w-[48px]'}
                variant={'secondary'}
                size={'medium'}
                onClick={isFriend ? handleRemoveFriend : handleAddFriend}
            >
                <span>{isFriend ? <Icons.Users /> : <Icons.PersonAdd />}</span>

                <p className="ml-2 md:hidden">
                    {isRequest && 'Đã gửi lời mời kết bạn'}
                    {isFriend && 'Hủy kết bạn'}
                    {!isFriend && 'Kết bạn'}
                </p>
            </Button>
        </div>
    );
};
export default Action;
