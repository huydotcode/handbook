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
    data: IGroupConversation;
    isSelect: boolean;
}

const FriendChatItem: React.FC<Props> = ({
    data: groupConversation,
    isSelect,
}) => {
    const { data: session } = useSession();

    const { lastMessages } = useChat();
    const router = useRouter();

    return (
        <>
            <Button
                className={cn(
                    'relative flex max-w-full justify-between rounded-none p-4 shadow-none md:justify-center md:p-2',
                    isSelect && 'bg-primary-1'
                )}
                key={groupConversation._id}
                onClick={() =>
                    router.push(`/messages/groups/${groupConversation._id}`)
                }
            >
                <div className="relative h-8 w-8">
                    <div className="h-8 w-8">
                        <Image
                            className="rounded-full"
                            priority={true}
                            src={groupConversation.avatar}
                            alt={groupConversation.name}
                            fill
                        />
                    </div>
                </div>

                <div className="flex flex-1 flex-col md:hidden">
                    <div className="flex items-center justify-between">
                        <h3 className="ml-2 whitespace-nowrap text-sm font-bold">
                            {groupConversation.name}
                        </h3>
                    </div>
                    <div className="ml-2 max-w-full overflow-ellipsis whitespace-nowrap text-start text-xs">
                        Tin nhắn cuối
                    </div>
                </div>
            </Button>
        </>
    );
};
export default FriendChatItem;
