'use client';
import { Button } from '@/components';
import { useAppContext } from '@/context/AppContext';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import React, { FormEventHandler } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { IoPersonAdd } from 'react-icons/io5';

interface Props {
    userId: string;
}

const Action: React.FC<Props> = ({ userId }) => {
    // const { friends } = useChat();
    const { friends } = useAppContext();
    const { socket } = useSocket();

    const isFriend = friends && friends.find((friend) => friend._id === userId);

    const handleAddFriend: FormEventHandler = async (e) => {
        e.preventDefault();

        if (socket) {
            await socket.emit('send-request-add-friend', {
                receiverId: userId,
            });
        }
    };

    const handleRemoveFriend = async () => {
        if (socket) {
            await socket.emit('un-friend', {
                friendId: userId,
            });
        }
    };

    return (
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
                {isFriend ? 'Hủy kết bạn' : 'Thêm bạn bè'}
            </p>
        </Button>
    );
};
export default Action;
