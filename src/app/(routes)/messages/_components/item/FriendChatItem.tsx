'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { Button, Icons } from '@/components/ui';
import { cn } from '@/lib/utils';
import generateRoomId from '@/utils/generateRoomId';
import { useChat } from '@/context';

interface Props {
    data: IFriend;
    isSelect: boolean;
}

const FriendChatItem: React.FC<Props> = ({ data: friend, isSelect }) => {
    const { data: session } = useSession();

    const { lastMessages } = useChat();

    const isOnline = friend.isOnline;
    const roomId = generateRoomId(session?.user.id || '', friend._id);
    const friendName =
        friend.name.split(' ')[friend.name.split(' ').length - 2];
    const lastMsg = lastMessages[roomId];

    return (
        <>
            <Button
                className={cn(
                    'relative flex max-w-full justify-between rounded-none p-4 shadow-none md:justify-center md:p-2',
                    isSelect && 'bg-primary-1'
                )}
                key={friend._id}
            >
                <div className="relative h-8 w-8">
                    <div className="h-8 w-8">
                        <Image
                            className="rounded-full"
                            priority={true}
                            src={friend.avatar}
                            alt={friend.name}
                            fill
                        />
                    </div>
                    <span className="absolute right-[-2] top-0 ml-2 text-xs md:right-4">
                        <Icons.Circle
                            className={`${isOnline ? 'text-primary-2' : 'text-secondary-1'}`}
                        />
                    </span>
                </div>

                <div className="flex flex-1 flex-col md:hidden">
                    <div className="flex items-center justify-between">
                        <h3 className="ml-2 whitespace-nowrap text-sm font-bold">
                            {friend.name}
                        </h3>
                    </div>
                    <div className="ml-2 max-w-full overflow-ellipsis whitespace-nowrap text-start text-xs">
                        {lastMsg?.text &&
                        lastMsg?.sender._id == session?.user.id
                            ? 'Bạn: '
                            : `${friendName}: `}
                        {lastMsg?.text ? lastMsg?.text : 'Chưa có tin nhắn'}
                    </div>
                </div>
            </Button>
        </>
    );
};
export default FriendChatItem;
