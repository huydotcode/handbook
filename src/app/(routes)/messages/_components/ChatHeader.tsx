'use client';
import { Button, Icons } from '@/components/ui';
import { cn } from '@/lib/utils';
import TimeAgoConverted from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

interface Props {
    currentRoom: IPrivateConversation;
    isPopup?: boolean;
}

const ChatHeader: React.FC<Props> = ({ isPopup, currentRoom }) => {
    return (
        <div className="flex h-16 items-center justify-between border-b p-4 dark:border-dark-secondary-2">
            <div className="flex items-center">
                <Image
                    className="rounded-full"
                    alt={currentRoom.friend.name}
                    src={currentRoom.friend.avatar}
                    width={32}
                    height={32}
                />
                <div className="flex flex-col">
                    <h3
                        className={cn('text-md ml-2 font-bold', {
                            'text-sm': isPopup,
                        })}
                    >
                        {currentRoom.friend.name}
                    </h3>

                    <span className="ml-2 text-xs ">
                        {currentRoom.friend.isOnline ? (
                            'Đang hoạt động'
                        ) : (
                            <TimeAgoConverted
                                time={currentRoom.friend.lastAccessed}
                                className="text-xs"
                                textBefore="Hoạt động "
                                textAfter=" trước"
                            />
                        )}
                    </span>
                </div>

                {isPopup && (
                    <Button
                        className="absolute right-2 top-2"
                        size={'medium'}
                        onClick={() => {}}
                    >
                        <Icons.Close />
                    </Button>
                )}
            </div>
        </div>
    );
};
export default ChatHeader;
