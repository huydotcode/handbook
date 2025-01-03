'use client';
import { Avatar, Button, Icons } from '@/components/ui';
import TimeAgoConverted from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo } from 'react';
import useBreakpoint from '@/hooks/useBreakpoint';
import { splitName } from '@/utils/splitName';
import { useRouter } from 'next/navigation';

interface Props {
    currentRoom: IConversation;
    handleOpenInfo: () => void;
    handleOpenSearch: () => void;
}

const ChatHeader: React.FC<Props> = ({
    currentRoom,
    handleOpenInfo,
    handleOpenSearch,
}) => {
    const { data: session } = useSession();
    const router = useRouter();

    const partner = useMemo(() => {
        if (currentRoom.group) {
            return null;
        } else {
            if (currentRoom.participants[0]._id === session?.user?.id) {
                return currentRoom.participants[1];
            } else {
                return currentRoom.participants[0];
            }
        }
    }, [currentRoom]);

    const { breakpoint } = useBreakpoint();

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
        <>
            <div className="flex h-16 items-center justify-between border-b p-4 dark:border-dark-secondary-2">
                <div className="flex items-center">
                    {breakpoint == 'sm' && (
                        <Button
                            className="mr-2 rounded-xl p-2 text-2xl hover:bg-primary-1 dark:hover:bg-dark-primary-1"
                            variant={'custom'}
                            onClick={() => router.push('/messages')}
                        >
                            <Icons.ArrowBack />
                        </Button>
                    )}

                    {currentRoom.group ? (
                        <Avatar
                            imgSrc={avatar}
                            alt={title}
                            className="h-10 w-10"
                        />
                    ) : (
                        <Avatar
                            imgSrc={avatar}
                            alt={title}
                            className="h-10 w-10"
                            userUrl={partner?._id}
                        />
                    )}

                    <div className="flex flex-col">
                        <h3 className="text-md ml-2 font-bold">
                            {currentRoom.group
                                ? title
                                : breakpoint == 'sm' && title
                                  ? splitName(title).lastName
                                  : title}
                        </h3>

                        {partner && (
                            <>
                                <span className="ml-2 text-xs ">
                                    {partner.isOnline ? (
                                        'Đang hoạt động'
                                    ) : (
                                        <TimeAgoConverted
                                            time={partner.lastAccessed}
                                            className="text-xs"
                                            textBefore={
                                                breakpoint == 'sm'
                                                    ? 'Online'
                                                    : 'Hoạt động'
                                            }
                                            textAfter=" trước"
                                        />
                                    )}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center">
                    <Button
                        className="rounded-xl p-2 hover:bg-primary-1 dark:hover:bg-dark-primary-1"
                        variant={'custom'}
                        onClick={handleOpenSearch}
                    >
                        <Icons.Search size={24} />
                    </Button>

                    <Button
                        className="rounded-xl p-2 hover:bg-primary-1 dark:hover:bg-dark-primary-1"
                        variant={'custom'}
                        onClick={() => handleOpenInfo()}
                    >
                        <Icons.More size={24} />
                    </Button>
                </div>
            </div>
        </>
    );
};
export default ChatHeader;
