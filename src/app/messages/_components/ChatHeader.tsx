'use client';
import { Button, Icons } from '@/components/ui';
import { useApp } from '@/context';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import TimeAgoConverted from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useMemo } from 'react';

interface Props {
    currentRoom: IRoomChat;
    isPopup?: boolean;
}

const ChatHeader: React.FC<Props> = ({ isPopup, currentRoom }) => {
    const { data: session } = useSession();
    const { friends } = useApp();
    const { setCurrentRoom, setRooms } = useChat();
    const userIsOnline = useMemo(() => {
        if (!currentRoom.id) return null;

        const friend = friends.find(
            (f) => f._id === currentRoom.id.replace(session?.user?.id || '', '')
        );

        return friend?.isOnline || false;
    }, [friends, session?.user?.id, currentRoom.id]);

    return (
        <div className="flex h-16 items-center justify-between border-b-2 p-4 dark:border-dark-secondary-2">
            <div className="flex items-center">
                <Image
                    className="rounded-full"
                    alt={currentRoom.name}
                    src={currentRoom.image}
                    width={32}
                    height={32}
                />
                <div className="flex flex-col">
                    <h3
                        className={cn('text-md ml-2 font-bold', {
                            'text-sm': isPopup,
                        })}
                    >
                        {currentRoom.name}
                    </h3>
                    <span className="ml-2 text-xs ">
                        {userIsOnline ? (
                            'Đang hoạt động'
                        ) : (
                            <TimeAgoConverted
                                time={currentRoom.lastAccessed}
                                className="text-xs "
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
                        onClick={() => {
                            setRooms((prev) => {
                                // Xóa phòng chat khỏi danh sách
                                return prev.filter(
                                    (room) => room.id !== currentRoom.id
                                );
                            });
                            setCurrentRoom({} as IRoomChat);
                        }}
                    >
                        <Icons.Close />
                    </Button>
                )}
            </div>
        </div>
    );
};
export default ChatHeader;
