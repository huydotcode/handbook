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

    // if (isFriend)
    //     return (
    //         <Button
    //             onClick={handleRemoveFriend}
    //             variant={'event'}
    //             size={'medium'}
    //         >
    //             Đã kết bạn
    //         </Button>
    //     );

    // return (
    //     <form onSubmit={handleAddFriend}>
    //         <Button className="bg-primary" variant={'event'} size={'medium'}>
    //             Thêm bạn bè
    //         </Button>
    //     </form>
    // );

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
                {isFriend ? 'Bỏ kết bạn' : 'Thêm bạn bè'}
            </p>
        </Button>
    );
};
export default Action;
