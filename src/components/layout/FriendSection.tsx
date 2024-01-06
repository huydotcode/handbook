'use client';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { cn } from '@/lib/utils';
import generateRoomId from '@/utils/generateRoomId';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaCircle } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Button } from '..';
import Avatar from '../Avatar';
import { useAppContext } from '@/context/AppContext';

interface Props {}

const FriendSection: React.FC<Props> = ({}) => {
    const { setCurrentRoom } = useChat();
    const { friends, loadingFriends } = useAppContext();
    const { data: session } = useSession();
    const { socket, isLoading } = useSocket();

    const [showFriendSection, setShowFriendSection] = useState(true);

    const handleClickFriend = async ({
        _id,
        image,
        name,
        lastAccessed,
    }: IFriend) => {
        if (!socket || !session) return;

        const roomId = generateRoomId(session.user.id, _id);

        await socket.emit('join-room', {
            roomId,
        });

        await socket.emit('read-message', {
            roomId: roomId,
        });

        setCurrentRoom({
            id: roomId,
            name: name,
            image: image,
            members: [session.user.id, _id],
            messages: [],
            lastAccessed: lastAccessed,
        });
    };

    const handleToggleShow = () => setShowFriendSection((prev) => !prev);

    if (!session) return <></>;

    return (
        <>
            <div
                className={cn(
                    'absolute pt-2 flex flex-col w-full rounded-l-xl bottom-0 right-0  border-l-2  bg-white dark:border-none transition-all duration-300 dark:bg-dark-200',
                    {
                        'mt-4 h-full': showFriendSection,
                        'h-0 overflow-hidden  p-0': !showFriendSection,
                    }
                )}
            >
                <div className="flex justify-between items-center px-2">
                    <h1 className="p-2 font-bold text-md">Bạn bè</h1>
                    <Button
                        className="dark:hover:bg-dark-500"
                        onClick={handleToggleShow}
                    >
                        <IoIosArrowDown />
                    </Button>
                </div>

                {isLoading ||
                    (loadingFriends && (
                        <div className="flex items-center justify-center h-full">
                            <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-gray-500" />
                        </div>
                    ))}

                {!isLoading && (
                    <div>
                        {friends.map((friend) => {
                            const isOnline = friend.isOnline;

                            console.log('friend', friend);

                            return (
                                <>
                                    <Button
                                        variant={'custom'}
                                        className="flex items-center justify-between p-3 shadow-sm w-full text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-500"
                                        key={friend._id}
                                        // href={`profile/${friend._id}`}
                                        onClick={() =>
                                            handleClickFriend(friend)
                                        }
                                    >
                                        <div className="flex items-center">
                                            <Avatar
                                                imgSrc={friend.image || ''}
                                            />
                                            <span className="ml-2">
                                                {friend.name}
                                            </span>
                                        </div>

                                        <span>
                                            {isOnline && (
                                                <FaCircle className="text-sm text-blue-500" />
                                            )}
                                        </span>
                                    </Button>
                                </>
                            );
                        })}
                    </div>
                )}
            </div>

            {!showFriendSection && (
                <Button
                    className="absolute bottom-1 right-4 opacity-50 hover:opacity-100 hover:bottom-4 transition-all duration-300 dark:hover:bg-dark-500"
                    onClick={handleToggleShow}
                >
                    <IoIosArrowUp />
                </Button>
            )}
        </>
    );
};
export default FriendSection;
