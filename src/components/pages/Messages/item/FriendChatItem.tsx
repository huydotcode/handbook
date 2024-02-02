'use client';
import { Button } from '@/components';
import Avatar from '@/components/Avatar';
import { useChat } from '@/context/ChatContext';
import generateRoomId from '@/utils/generateRoomId';
import { useSession } from 'next-auth/react';
import React from 'react';
import { FaCircle } from 'react-icons/fa';

interface Props {
    data: IFriend;
}

const FriendChatItem: React.FC<Props> = ({ data: friend }) => {
    const { data: session } = useSession();
    const { currentRoom, lastMessages, loading, conversations } = useChat();
    const isOnline = friend.isOnline;

    const isSelect =
        currentRoom.id == [session?.user.id, friend._id].sort().join('');

    const roomId = generateRoomId(session?.user.id || '', friend._id);

    const lastMsg = lastMessages.find((msg) => msg.roomId == roomId);

    const friendName =
        friend.name.split(' ')[friend.name.split(' ').length - 2];

    return (
        <>
            <Button
                className={`flex h-[60px] w-full cursor-pointer items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-500 ${
                    isSelect && 'bg-gray-200 dark:bg-dark-500'
                }`}
                variant={'custom'}
                key={friend._id}
                href={`/messages/f/${friend._id}`}
            >
                <Avatar imgSrc={friend.image} />

                <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                        <h3 className="ml-2 whitespace-nowrap text-sm font-bold">
                            {friend.name}
                        </h3>
                        <span className="ml-2 text-xs text-gray-500">
                            <FaCircle
                                className={`${
                                    isOnline ? 'text-blue-600' : 'text-gray-500'
                                }`}
                            />
                        </span>
                    </div>
                    <p className="ml-2 text-xs text-gray-500">
                        {lastMsg?.text && lastMsg?.userId == session?.user.id
                            ? 'Bạn: '
                            : `${friendName}: `}
                        {lastMsg?.text || 'Chưa có tin nhắn'}
                    </p>
                </div>
            </Button>
        </>
    );
};
export default FriendChatItem;
