'use client';
import { Avatar, Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import useBreakpoint from '@/hooks/useBreakpoint';
import { splitName } from '@/utils/splitName';
import { timeConvert3 } from '@/utils/timeConvert';
import { useEditor } from '@tiptap/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

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
    const { breakpoint } = useBreakpoint();

    const roomType = currentRoom.type;

    const partner = useMemo(() => {
        if (roomType == 'group') {
            return null;
        } else {
            if (currentRoom.participants[0]._id === session?.user?.id) {
                return currentRoom.participants[1];
            } else {
                return currentRoom.participants[0];
            }
        }
    }, [currentRoom, session?.user.id, roomType]);

    const title = useMemo(() => {
        if (roomType == 'group') {
            return currentRoom.title;
        } else if (roomType == 'private') {
            return partner?.name;
        } else {
            return '';
        }
    }, [currentRoom.title, partner?.name, roomType]);

    const avatar = useMemo(() => {
        if (roomType == 'group' && currentRoom.group) {
            return currentRoom.group.avatar.url;
        } else {
            return partner?.avatar;
        }
    }, [currentRoom.group, partner?.avatar, roomType]);

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

                    {roomType == 'group' ? (
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
                            {roomType == 'group'
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
                                        <>
                                            Hoạt động{' '}
                                            {timeConvert3(
                                                partner.lastAccessed.toString(),
                                                'trước'
                                            )}
                                        </>
                                    )}
                                </span>
                            </>
                        )}

                        {roomType == 'group' && (
                            <span className="ml-2 text-xs">
                                {currentRoom.group?.name}
                            </span>
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
