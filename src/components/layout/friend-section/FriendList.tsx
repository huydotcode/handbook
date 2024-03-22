'use client';
import { Items } from '@/components/shared';
import { Icons } from '@/components/ui';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Props {
    className?: string;
    data: IFriend[];
}

const FriendList: React.FC<Props> = ({ data: friends, className }) => {
    const path = usePathname();

    return (
        <>
            <div
                className={cn(
                    'flex h-full w-full flex-col border-l-2 pl-2 pt-2 transition-all duration-500 dark:border-none',
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
                        friends.map((friend) => (
                            <Items.Friend key={friend._id} data={friend} />
                        ))}
                </div>
            </div>
        </>
    );
};
export default FriendList;
