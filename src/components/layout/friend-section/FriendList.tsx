'use client';
import { Icons } from '@/components/ui';
import { useConversations, useFriends } from '@/context/SocialContext';
import { cn } from '@/lib/utils';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface Props {
    className?: string;
    session: Session;
}

const FriendList: React.FC<Props> = ({ session, className }) => {
    const path = usePathname();

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

                <div className="mt-2 flex flex-col">
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
                                <DropdownMenu key={friend._id}>
                                    <DropdownMenuTrigger asChild={true}>
                                        <Button
                                            variant={'custom'}
                                            className="flex w-full cursor-pointer items-center justify-between px-2 py-1 text-sm shadow-sm hover:bg-hover-1 dark:hover:bg-dark-hover-1 lg:justify-center"
                                            key={friend._id}
                                        >
                                            <div className="flex items-center lg:h-8 lg:w-8">
                                                <Image
                                                    className="rounded-full"
                                                    src={friend.avatar || ''}
                                                    alt={friend.name || ''}
                                                    width={32}
                                                    height={32}
                                                />

                                                <span className="ml-2 text-xs lg:hidden">
                                                    {friend.name}
                                                </span>
                                            </div>

                                            <span className="lg:hidden">
                                                {friend.isOnline && (
                                                    <Icons.Circle className="text-sm text-primary-2" />
                                                )}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align={'start'}>
                                        <DropdownMenuItem className={'p-0'}>
                                            <Button
                                                className={
                                                    'w-full justify-start'
                                                }
                                                variant={'ghost'}
                                                size={'xs'}
                                                href={`/profile/${friend._id}`}
                                            >
                                                <Icons.Users />
                                                Trang cá nhân
                                            </Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className={'p-0'}>
                                            <Button
                                                className={
                                                    'w-full justify-start'
                                                }
                                                variant={'ghost'}
                                                size={'xs'}
                                                href={`/messages/${conversation._id}`}
                                            >
                                                <Icons.Message />
                                                Nhắn tin
                                            </Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            );
                        })}
                </div>
            </div>
        </>
    );
};
export default FriendList;
