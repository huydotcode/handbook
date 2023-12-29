'use client';
import { Button } from '@/components';
import Avatar from '@/components/Avatar';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { cn } from '@/lib/utils';
import generateRoomId from '@/utils/generateRoomId';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa6';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

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
    const [showSidebar, setShowSidebar] = useState(true);
    const [isHover, setIsHover] = useState(false);

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

        setShowSidebar(false);
    };

    const handleToggleSidebar = () => {
        setShowSidebar((prev) => !prev);
    };

    useEffect(() => {
        // check if window width is less than 768px than setShowSidebar fasle
        // use resize

        window.onresize = () => {
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            } else {
                setShowSidebar(true);
            }
        };
    }, []);

    if (!session) return null;

    return (
        <>
            <Button
                className={cn(
                    'hidden md:block absolute top-16 left-1 text-3xl w-12 h-12 z-20 bg-white dark:bg-gray-800 dark:text-gray-300 transition-all duration-300',
                    {
                        '-left-4 opacity-40': !isHover,
                        '-left-1': isHover,
                        block: !showSidebar,
                    }
                )}
                onClick={handleToggleSidebar}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {showSidebar ? <IoIosArrowBack /> : <IoIosArrowForward />}
            </Button>

            <div
                className={cn(
                    'md:fixed top-[56px] left-0 flex flex-col border-r dark:border-r-gray-600 z-10 max-w-[300px] h-[calc(100vh-56px-57px)] bg-white dark:bg-dark-200 transition-all duration-500',
                    {
                        'w-0 overflow-hidden border-none': !showSidebar,
                        'w-[40%] min-w-[200px]': showSidebar,
                    }
                )}
            >
                {friends.map((user: IFriend) => {
                    const isOnline = friendsOnline.find(
                        (f) => f.userId === user._id
                    );

                    const isSelect =
                        currentRoom.id ==
                        [session.user.id, user._id].sort().join('');

                    const lastMsg = lastMessages.find(
                        (msg) =>
                            msg.roomId ===
                            generateRoomId(session.user.id, user._id)
                    );

                    return (
                        <div
                            className={`flex items-center w-full h-[60px] px-4 py-2 hover:bg-gray-200 cursor-pointer ${
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
                                        {lastMsg.data.text ||
                                            'Chưa có tin nhắn'}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {friends.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 max-w-[200px]">
                            Bạn chưa có bạn bè nào, hãy thêm bạn bè để bắt đầu
                            trò chuyện
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};
export default Sidebar;
