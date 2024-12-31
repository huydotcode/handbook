'use client';
import { Items } from '@/components/shared';
import { Icons } from '@/components/ui';
import { useConversations, useFriends } from '@/context/SocialContext';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Props {
    className?: string;
}

const FriendList: React.FC<Props> = ({ className }) => {
    const path = usePathname();
    const { data: session } = useSession();
    const { data: conversations } = useConversations(session?.user.id);
    const { data: friends } = useFriends(session?.user.id);

    return (
        <>
            <div
                className={cn(
                    'flex h-full w-full flex-col pl-2 pt-2 transition-all duration-500 dark:border-none',
                    path !== '/' && 'bg-white dark:bg-dark-secondary-1'
                )}
            >
                <div className="flex items-center justify-between px-2">
                    <h1 className="text-md font-bold lg:hidden">
                        Bạn bè{' '}
                        <span className="ml-2 text-sm text-secondary-1">
                            {friends && friends.length}
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
                                            participant._id === friendId ||
                                            participant._id === userId
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
