'use client';
import { Button } from '@/components/ui';
import Icons from '@/components/ui/Icons';
import socketEvent from '@/constants/socketEvent.constant';

import { useSocial, useSocket } from '@/context';
import { sendRequestAddFriend } from '@/lib/actions/notification.action';
import { NotificationService, UserService } from '@/lib/services';
import logger from '@/utils/logger';
import React, { FormEventHandler, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    userId: string;
}

const Action: React.FC<Props> = ({ userId }) => {
    const { socket } = useSocket();

    const { friends, setFriends } = useSocial();

    const isFriend = friends && friends.find((friend) => friend._id === userId);
    const [isRequest, setIsRequest] = useState<boolean>(false);

    const handleAddFriend: FormEventHandler = async (e) => {
        if (isRequest) return;

        e.preventDefault();

        try {
            const requestAddFriend =
                await NotificationService.sendRequestAddFriend({
                    receiverId: userId,
                });

            if (socket) {
                await socket.emit(socketEvent.SEND_REQUEST_ADD_FRIEND, {
                    request: requestAddFriend,
                });
            }
            toast.success('Đã gửi lời mời kết bạn');
        } catch (error) {
            logger({
                message: 'Error handle add friend' + error,
                type: 'error',
            });
            toast.error('Đã có lỗi xảy ra khi gửi lời mời kết bạn!');
        } finally {
            setIsRequest(true);
        }
    };

    const handleRemoveFriend = async () => {
        try {
            await UserService.unfriend({ friendId: userId });

            setFriends((prev) =>
                prev.filter((friend) => friend._id !== userId)
            );

            toast.success('Đã hủy kết bạn');
        } catch (error) {
            logger({
                message: 'Error handle remove friend' + error,
                type: 'error',
            });
            toast.error('Đã có lỗi xảy ra khi hủy kết bạn!');
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
                    isFriend
                        ? `/messages/friends/${userId}`
                        : `/messages/r/${userId}`
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
                    {!isFriend && !isRequest && 'Kết bạn'}
                </p>
            </Button>
        </div>
    );
};
export default Action;
