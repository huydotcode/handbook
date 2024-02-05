'use client';
import { useAppContext } from '@/context/AppContext';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import { Button } from '..';
import Items from '../item/Items';
import NotificationList from '../navbar/notification/NotificationList';
import { ChatBox } from '../../app/messages/_components';
import Icons from '../ui/Icons';

interface Props {
    className?: string;
    show?: boolean;
}

const FriendSection: React.FC<Props> = ({ className, show }) => {
    const { rooms } = useChat();
    const { friends, loadingFriends, notifications } = useAppContext();
    const { data: session } = useSession();
    const { socket, isLoading } = useSocket();

    const haveNotificationFriend =
        notifications &&
        notifications.filter((noti) => noti.type == 'friend').length > 0;

    const [showFriendSection, setShowFriendSection] = useState(show);

    const handleToggleShow = () => setShowFriendSection((prev) => !prev);

    if ((!socket && !isLoading) || !session) return null;

    return (
        <>
            <aside
                className={
                    'fixed right-0 top-[72px] flex h-[calc(100vh-72px)] justify-end md:hidden ' +
                    className
                }
            >
                <div className="relative h-full w-[200px] lg:w-[70px]">
                    <div
                        className={cn(
                            'absolute bottom-0 right-0 flex h-[calc(100vh-72px)] w-full flex-col rounded-l-xl border-l-2  bg-white pt-2 transition-all duration-500 dark:border-none dark:bg-dark-200',
                            {
                                'mt-4 h-full': showFriendSection,
                                'h-0 overflow-hidden p-0': !showFriendSection,
                            }
                        )}
                    >
                        {haveNotificationFriend && (
                            <>
                                <div className="flex items-center justify-between px-2">
                                    <h1 className="text-md p-2 font-bold">
                                        Lời mời kết bạn
                                    </h1>
                                    <Button
                                        className="dark:hover:bg-dark-500 lg:hidden"
                                        onClick={handleToggleShow}
                                    >
                                        <Icons.ArrowDown />
                                    </Button>
                                </div>

                                <NotificationList showMessage={false} />
                            </>
                        )}

                        <div className="flex items-center justify-between px-2">
                            <h1 className="text-md p-2 font-bold lg:hidden">
                                Bạn bè
                            </h1>

                            <div className="hidden w-full items-center justify-center p-1 lg:flex">
                                <Icons.Users />
                            </div>

                            {!haveNotificationFriend && (
                                <Button
                                    className="dark:hover:bg-dark-500 lg:hidden"
                                    onClick={handleToggleShow}
                                >
                                    <Icons.ArrowDown />
                                </Button>
                            )}
                        </div>

                        {isLoading ||
                            (loadingFriends && (
                                <div className="flex h-full items-center justify-center">
                                    <Icons.Loading className="h-8 w-8 animate-spin text-gray-500" />
                                </div>
                            ))}

                        {!isLoading && (
                            <>
                                {friends &&
                                    friends.map((friend) => (
                                        <>
                                            <Items.Friend
                                                key={friend._id}
                                                data={friend}
                                            />
                                        </>
                                    ))}
                            </>
                        )}
                    </div>

                    {!showFriendSection && (
                        <Button
                            className="absolute  bottom-1 right-4 opacity-50 transition-all duration-300 hover:bottom-4 hover:opacity-100 dark:hover:bg-dark-500"
                            onClick={handleToggleShow}
                        >
                            <Icons.ArrowUp />
                        </Button>
                    )}

                    <div className="absolute bottom-0 right-[100%] flex">
                        {rooms.map((room) => {
                            return (
                                <ChatBox
                                    key={room.id}
                                    className="shadow-xl"
                                    currentRoom={room}
                                    isPopup
                                />
                            );
                        })}
                    </div>
                </div>
            </aside>
        </>
    );
};
export default FriendSection;
