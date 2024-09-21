'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Props {
    data: IConversation;
    isSelect: boolean;
}

const FriendChatItem: React.FC<Props> = ({
    data: groupConversation,
    isSelect,
}) => {
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
                            src={groupConversation.group?.coverPhoto || ''}
                            alt={groupConversation.group?.name || ''}
                            fill
                        />
                    </div>
                </div>

                <div className="flex flex-1 flex-col md:hidden">
                    <div className="flex items-center justify-between">
                        <h3 className="ml-2 whitespace-nowrap text-sm font-bold">
                            {groupConversation.group?.name}
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
