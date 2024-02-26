'use client';
import { ChatBox } from '@/app/messages/_components';
import { Items } from '@/components/shared';
import { Button, Icons } from '@/components/ui';
import { useApp } from '@/context';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface Props {
    className?: string;
    data: IFriend[];
    show?: boolean;
}

const FriendList: React.FC<Props> = ({
    data: friends,
    className,
    show = true,
}) => {
    const path = usePathname();
    const [showFriendSection, setShowFriendSection] = useState<boolean>(show);
    const handleToggleShow = () => setShowFriendSection((prev) => !prev);
    const { rooms } = useChat();
    const { loadingFriends } = useApp();

    return (
        <>
            <div
                className={cn(
                    'absolute bottom-0 right-0 flex h-[calc(100vh-72px)] w-[200px] flex-col border-l-2 pl-2 pt-2 transition-all duration-500 dark:border-none lg:w-fit',
                    {
                        'mt-4 h-full': showFriendSection,
                        'h-0 overflow-hidden p-0': !showFriendSection,
                    },
                    path !== '/' && 'bg-white dark:bg-dark-secondary-1'
                )}
            >
                <div className="flex items-center justify-between px-2">
                    <h1 className="text-md p-2 font-bold lg:hidden">Bạn bè</h1>

                    <div className="hidden w-full items-center justify-center p-1 lg:flex">
                        <Icons.Users />
                    </div>

                    <Button
                        className="lg:hidden"
                        onClick={handleToggleShow}
                        size={'medium'}
                    >
                        <Icons.ArrowDown />
                    </Button>
                </div>

                {loadingFriends && (
                    <div className="flex h-full items-center justify-center">
                        <Icons.Loading className="h-8 w-8 animate-spin " />
                    </div>
                )}

                {!loadingFriends && (
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
                    className=" absolute bottom-1 right-4 opacity-50 transition-all duration-300 hover:bottom-4 hover:opacity-100"
                    onClick={handleToggleShow}
                    size={'medium'}
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
        </>
    );
};
export default FriendList;
