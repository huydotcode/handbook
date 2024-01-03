'use client';
import { Button } from '@/components';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import React, { FormEventHandler } from 'react';

interface Props {
    userId: string;
}

const Action: React.FC<Props> = ({ userId }) => {
    const { friends } = useChat();
    const { socket } = useSocket();
    const handleAddFriend: FormEventHandler = async (e) => {
        e.preventDefault();

        if (socket) {
            await socket.emit('add-friend', {
                friendId: userId,
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

    if (friends.find((friend) => friend._id === userId))
        return (
            <Button
                onClick={handleRemoveFriend}
                variant={'event'}
                size={'medium'}
            >
                Đã kết bạn
            </Button>
        );

    return (
        <form onSubmit={handleAddFriend}>
            <Button className="bg-primary" variant={'event'} size={'medium'}>
                Thêm bạn bè
            </Button>
        </form>
    );
};
export default Action;
