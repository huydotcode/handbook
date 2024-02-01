'use client';
import { Button } from '@/components';
import { useAppContext } from '@/context/AppContext';
import { useSocket } from '@/context/SocketContext';
import React, { FormEventHandler, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaUserFriends } from 'react-icons/fa';
import { IoChatbubbleEllipses, IoPersonAdd } from 'react-icons/io5';

interface Props {
    userId: string;
}

const Action: React.FC<Props> = ({ userId }) => {
    const { friends } = useAppContext();
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
                className={`mr-2 h-12 min-w-[48px] bg-primary text-white`}
                variant={'event'}
                size={'medium'}
                href={
                    isFriend ? `/messages/f/${userId}` : `/messages/r/${userId}`
                }
            >
                <span>
                    <IoChatbubbleEllipses />
                </span>

                <p className="ml-2 md:hidden">Nhắn tin</p>
            </Button>

            <Button
                className={`${
                    !isFriend && 'bg-primary text-white'
                } h-12 min-w-[48px]`}
                variant={'event'}
                size={'medium'}
                onClick={isFriend ? handleRemoveFriend : handleAddFriend}
            >
                <span>{isFriend ? <FaUserFriends /> : <IoPersonAdd />}</span>

                <p className="ml-2 md:hidden">
                    {isRequest && !isFriend
                        ? 'Đã gửi lời mời kết bạn'
                        : isFriend
                          ? 'Hủy kết bạn'
                          : 'Thêm bạn bè'}
                </p>
            </Button>
        </div>
    );
};
export default Action;
