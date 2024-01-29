'use client';
import { Button } from '@/components';
import Avatar from '@/components/Avatar';
import { useAppContext } from '@/context/AppContext';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { cn } from '@/lib/utils';
import generateRoomId from '@/utils/generateRoomId';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCircle } from 'react-icons/fa6';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface Props {
    firstShow?: boolean;
}

const Sidebar: React.FC<Props> = ({ firstShow = true }) => {
    const { data: session } = useSession();
    const { friends } = useAppContext();
    const {
        currentRoom,
        setCurrentRoom,
        lastMessages,
        loading,
        conversations,
        messages,
    } = useChat();
    const { socket } = useSocket();
    const [showSidebar, setShowSidebar] = useState(firstShow);
    const [isHover, setIsHover] = useState(false);

    const handleJoinRoom = async (friend: IFriend) => {
        if (!socket || !session) return;

        const roomId = [session.user.id, friend._id].sort().join('');

        // await socket.emit('join-room', {
        //     roomId,
        // });

        // await socket.emit('read-message', {
        //     roomId: roomId,
        // });

        setCurrentRoom({
            id: roomId,
            name: friend.name,
            image: friend.image,
            members: [session.user.id, friend._id],
            messages: [],
            lastAccessed: friend.lastAccessed,
            type: 'f',
        });

        if (window.innerWidth < 768) {
            setShowSidebar(false);
        }
    };

    const handleToggleSidebar = () => {
        setShowSidebar((prev) => !prev);
    };

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
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
                    'md:fixed top-[56px] left-0 flex flex-col border-r dark:border-r-gray-600 z-10 max-w-[300px] min-h-[calc(100vh-56px-54px)] bg-white dark:bg-dark-200 transition-all duration-500 overflow-x-hidden',
                    {
                        'w-0  border-none': !showSidebar,
                        'w-[40%]': showSidebar,
                        'h-[calc(100vh-56px)]': !!!currentRoom.id,
                    }
                )}
            >
                <span className="p-2 text-xl font-bold border-b text-center">
                    Bạn bè
                </span>

                {friends &&
                    friends.map((friend: IFriend) => {
                        const isOnline = friend.isOnline;

                        const isSelect =
                            currentRoom.id ==
                            [session.user.id, friend._id].sort().join('');

                        const roomId = generateRoomId(
                            session.user.id,
                            friend._id
                        );

                        const lastMsg = lastMessages.find(
                            (msg) => msg.roomId == roomId
                        );

                        const friendName =
                            friend.name.split(' ')[
                                friend.name.split(' ').length - 2
                            ];

                        return (
                            <>
                                <Button
                                    className={`flex items-center w-full h-[60px] px-4 py-2 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-500 ${
                                        isSelect &&
                                        'bg-gray-200 dark:bg-dark-500'
                                    }`}
                                    variant={'custom'}
                                    key={friend._id}
                                    href={`/messages/f/${friend._id}`}
                                >
                                    <Avatar imgSrc={friend.image} />

                                    <div className="flex flex-1 flex-col">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-sm ml-2 whitespace-nowrap">
                                                {friend.name}
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
                                        <p className="text-xs text-gray-500 ml-2">
                                            {lastMsg?.text &&
                                            lastMsg?.userId == session.user.id
                                                ? 'Bạn: '
                                                : `${friendName}: `}
                                            {lastMsg?.text ||
                                                'Chưa có tin nhắn'}
                                        </p>
                                    </div>
                                </Button>
                            </>
                        );
                    })}

                {conversations && conversations.length > 0 && (
                    <>
                        <span className="p-2 text-xl font-bold border-b text-center">
                            Người lạ
                        </span>

                        {conversations.map((conversation: IRoomChat) => {
                            const otherUserId = conversation.id.replace(
                                session.user.id,
                                ''
                            );

                            const isSelect = currentRoom.id == conversation.id;

                            return (
                                <>
                                    <Button
                                        className={`flex items-center w-full h-[60px] px-4 py-2 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-500 ${
                                            isSelect &&
                                            'bg-gray-200 dark:bg-dark-500'
                                        }`}
                                        key={otherUserId}
                                        href={`/messages/r/${otherUserId}`}
                                        variant={'custom'}
                                    >
                                        <Avatar imgSrc={conversation.image} />

                                        <div className="flex flex-1 flex-col">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-sm ml-2 whitespace-nowrap">
                                                    {conversation.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </Button>
                                </>
                            );
                        })}
                    </>
                )}

                {!loading.friends && friends.length === 0 && (
                    <div className="flex items-center justify-center h-full p-4 text-justify">
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
