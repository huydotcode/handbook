'use client';
import React from 'react';
import { Avatar, Button, Icons } from '@/components/ui';
import { cn } from '@/lib/utils';
import TimeAgoConverted from '@/utils/timeConvert';

interface Props {
    currentRoom: IConversation;
    isPopup?: boolean;
}

const ChatHeader: React.FC<Props> = ({ isPopup, currentRoom }) => {
    return (
        <div className="flex h-16 items-center justify-between border-b p-4 dark:border-dark-secondary-2">
            <div className="flex items-center">
                {currentRoom.group ? (
                    <Avatar
                        imgSrc={currentRoom.group.avatar}
                        alt={currentRoom.group.name}
                        className="h-10 w-10"
                    />
                ) : (
                    <Avatar
                        imgSrc={currentRoom.participants[0].user.avatar}
                        alt={currentRoom.participants[0].user.name}
                        className="h-10 w-10"
                    />
                )}

                <div className="flex flex-col">
                    <h3
                        className={cn('text-md ml-2 font-bold', {
                            'text-sm': isPopup,
                        })}
                    >
                        {currentRoom.group
                            ? currentRoom.group.name
                            : currentRoom.participants[0].user.name}
                    </h3>

                    <span className="ml-2 text-xs ">
                        {!currentRoom.group && (
                            <>
                                {currentRoom.participants[0].user.isOnline ? (
                                    'Đang hoạt động'
                                ) : (
                                    <TimeAgoConverted
                                        time={
                                            currentRoom.participants[0].user
                                                .lastAccessed
                                        }
                                        className="text-xs"
                                        textBefore="Hoạt động"
                                        textAfter=" trước"
                                    />
                                )}
                            </>
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
