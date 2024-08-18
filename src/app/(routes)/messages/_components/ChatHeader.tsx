'use client';
import { Avatar } from '@/components/ui';
import TimeAgoConverted from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import React, { useMemo } from 'react';

interface Props {
    currentRoom: IConversation;
}

const ChatHeader: React.FC<Props> = ({ currentRoom }) => {
    const { data: session } = useSession();

    const partner = useMemo(() => {
        if (currentRoom.group) {
            return null;
        } else {
            if (currentRoom.participants[0].user._id === session?.user?.id) {
                return currentRoom.participants[1].user;
            } else {
                return currentRoom.participants[0].user;
            }
        }
    }, [currentRoom]);

    const title = useMemo(() => {
        if (currentRoom.group) {
            return currentRoom.group.name;
        } else {
            return partner?.name;
        }
    }, [currentRoom]);

    const avatar = useMemo(() => {
        if (currentRoom.group) {
            return currentRoom.group.avatar;
        } else {
            return partner?.avatar;
        }
    }, [currentRoom]);

    return (
        <div className="flex h-16 items-center justify-between border-b p-4 dark:border-dark-secondary-2">
            <div className="flex items-center">
                {currentRoom.group ? (
                    <Avatar imgSrc={avatar} alt={title} className="h-10 w-10" />
                ) : (
                    <Avatar imgSrc={avatar} alt={title} className="h-10 w-10" />
                )}

                <div className="flex flex-col">
                    <h3 className="text-md ml-2 font-bold">{title}</h3>

                    {partner && (
                        <>
                            <span className="ml-2 text-xs ">
                                {partner.isOnline ? (
                                    'Đang hoạt động'
                                ) : (
                                    <TimeAgoConverted
                                        time={partner.lastAccessed}
                                        className="text-xs"
                                        textBefore="Hoạt động"
                                        textAfter=" trước"
                                    />
                                )}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ChatHeader;
