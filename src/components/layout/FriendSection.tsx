'use client';
import { useAppContext } from '@/context/AppContext';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaUserFriends } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Button } from '..';
import FriendItem from '../item/FriendItem';
import NotificationList from '../navbar/notification/NotificationList';
import { ChatBox } from '../pages/Messages';

const FriendSection: React.FC = ({}) => {
    const { rooms } = useChat();
    const { friends, loadingFriends, notifications } = useAppContext();
    const { data: session } = useSession();
    const { socket, isLoading } = useSocket();

    const haveNotificationFriend =
        notifications &&
        notifications.filter((noti) => noti.type == 'friend').length > 0;

    const [showFriendSection, setShowFriendSection] = useState(true);

    const handleToggleShow = () => setShowFriendSection((prev) => !prev);

    if ((!socket && !isLoading) || !session) return null;

    return (
        <>
            <div className="mt-4 relative w-[200px] h-[calc(100vh-72px)] lg:w-[70px]">
                <div
                    className={cn(
                        'absolute pt-2 flex flex-col w-full h-[calc(100vh-72px)] rounded-l-xl bottom-0 right-0  border-l-2 bg-white dark:border-none transition-all duration-500 dark:bg-dark-200',
                        {
                            'mt-4 h-full': showFriendSection,
                            'h-0 overflow-hidden  p-0': !showFriendSection,
                        }
                    )}
                >
                    {haveNotificationFriend && (
                        <>
                            <div className="flex justify-between items-center px-2">
                                <h1 className="p-2 font-bold text-md">
                                    Lời mời kết bạn
                                </h1>
                                <Button
                                    className="dark:hover:bg-dark-500 lg:hidden"
                                    onClick={handleToggleShow}
                                >
                                    <IoIosArrowDown />
                                </Button>
                            </div>

                            <NotificationList showMessage={false} />
                        </>
                    )}

                    <div className="flex justify-between items-center px-2">
                        <h1 className="p-2 font-bold text-md lg:hidden">
                            Bạn bè
                        </h1>

                        <div className="w-full p-1 hidden lg:block">
                            <FaUserFriends className="w-8 h-8" />
                        </div>

                        {!haveNotificationFriend && (
                            <Button
                                className="dark:hover:bg-dark-500 lg:hidden"
                                onClick={handleToggleShow}
                            >
                                <IoIosArrowDown />
                            </Button>
                        )}
                    </div>

                    {isLoading ||
                        (loadingFriends && (
                            <div className="flex items-center justify-center h-full">
                                <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-gray-500" />
                            </div>
                        ))}

                    {!isLoading && (
                        <div>
                            {friends &&
                                friends.map((friend) => (
                                    <FriendItem
                                        key={friend._id}
                                        data={friend}
                                    />
                                ))}
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

                <div className="flex absolute bottom-0 right-[100%]">
                    {rooms.map((room) => {
                        return (
                            <ChatBox
                                className="shadow-xl"
                                currentRoom={room}
                                isPopup
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
};
export default FriendSection;
