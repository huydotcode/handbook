'use client';
import { Items } from '@/components/shared';
import { Icons } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Props {
    className?: string;
    friends: IFriend[];
    conversations: IConversation[];
}

const FriendList: React.FC<Props> = ({ friends, className, conversations }) => {
    const path = usePathname();

    const { data: session } = useSession();

    return (
        <>
            <div
                className={cn(
                    'flex h-full w-full flex-col pl-2 pt-2 transition-all duration-500 dark:border-none',
                    path !== '/' && 'bg-white dark:bg-dark-secondary-1'
                )}
            >
                <div className="flex items-center justify-between px-2">
                    <h1 className="text-md p-2 font-bold lg:hidden">
                        Bạn bè{' '}
                        <span className="ml-2 text-sm text-secondary-1">
                            {friends.length}
                        </span>
                    </h1>

                    <div className="hidden w-full items-center justify-center p-1 lg:flex">
                        <Icons.Users />
                    </div>
                </div>

                <div className="mt-2">
                    {friends &&
                        friends.map((friend) => {
                            const conversation =
                                conversations &&
                                conversations.find((conversation) => {
                                    const friendId = friend._id;
                                    const userId = session?.user.id;

                                    return conversation.participants.some(
                                        (participant) =>
                                            participant.user._id === friendId ||
                                            participant.user._id === userId
                                    );
                                });

                            if (!conversation) return null;

                            return (
                                <Items.Friend
                                    key={friend._id}
                                    data={friend}
                                    conversation={conversation}
                                />
                            );
                        })}
                </div>
            </div>
        </>
    );
};
export default FriendList;
