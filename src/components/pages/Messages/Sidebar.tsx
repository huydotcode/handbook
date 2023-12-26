'use client';
import Avatar from '@/components/Avatar';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import generateRoomId from '@/utils/generateRoomId';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { FaCircle } from 'react-icons/fa6';

interface Props {}

const Sidebar: React.FC<Props> = () => {
    const { data: session } = useSession();
    const {
        friends,
        currentRoom,
        setCurrentRoom,
        friendsOnline,
        lastMessages,
    } = useChat();
    const { socket } = useSocket();

    const handleJoinRoom = async (friend: IFriend) => {
        if (!socket || !session) return;

        const roomId = [session.user.id, friend._id].sort().join('');

        await socket.emit('join-room', {
            roomId,
        });

        await socket.emit('read-message', {
            roomId: roomId,
        });

        setCurrentRoom({
            id: roomId,
            name: friend.name,
            image: friend.image,
            members: [session.user.id, friend._id],
            messages: [],
        });
    };

    if (!session) return null;

    return (
        <div className=" sm:hidden flex flex-col border-r dark:border-r-gray-600">
            {friends.map((user: IFriend) => {
                const isOnline = friendsOnline.find(
                    (f) => f.userId === user._id
                );

                const isSelect =
                    currentRoom.id ==
                    [session.user.id, user._id].sort().join('');

                const lastMsg = lastMessages.find(
                    (msg) =>
                        msg.roomId === generateRoomId(session.user.id, user._id)
                );

                return (
                    <div
                        className={`min-w-[300px] flex items-center w-full h-[60px] px-4 py-2 hover:bg-gray-200 cursor-pointer ${
                            isSelect && 'bg-gray-200 dark:bg-gray-800'
                        }`}
                        key={user._id}
                        onClick={() => handleJoinRoom(user)}
                    >
                        <Avatar imgSrc={user.image} />

                        <div className="flex flex-1 flex-col">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-sm ml-2">
                                    {user.name}
                                </h3>
                                <span className="text-xs ml-2 text-gray-500">
                                    <FaCircle
                                        className={`${
                                            isOnline
                                                ? 'text-blue-600'
                                                : 'text-gray-500'
                                        }`}
                                    />
                                </span>
                            </div>
                            {lastMsg && (
                                <p className="text-xs text-gray-500 ml-2">
                                    {lastMsg.data.text || 'Chưa có tin nhắn'}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}

            {friends.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 max-w-[200px]">
                        Bạn chưa có bạn bè nào, hãy thêm bạn bè để bắt đầu trò
                        chuyện
                    </p>
                </div>
            )}
        </div>
    );
};
export default Sidebar;
