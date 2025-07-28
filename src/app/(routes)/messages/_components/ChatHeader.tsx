'use client';
import { Avatar, Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import useBreakpoint from '@/hooks/useBreakpoint';
import { cn } from '@/lib/utils';
import { timeConvert3 } from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

interface Props {
    openInfo: boolean;
    openSearch: boolean;
    currentRoom: IConversation;
    handleOpenInfo: () => void;
    handleOpenSearch: () => void;
}

const ChatHeader: React.FC<Props> = ({
    openInfo,
    openSearch,
    currentRoom,
    handleOpenInfo,
    handleOpenSearch,
}) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { breakpoint } = useBreakpoint();

    const roomType = currentRoom.type;
    const isGroup = roomType === 'group';

    const partner = useMemo(() => {
        if (isGroup) {
            return null;
        } else {
            if (currentRoom.participants[0]._id === session?.user?.id) {
                return currentRoom.participants[1];
            } else {
                return currentRoom.participants[0];
            }
        }
    }, [isGroup, currentRoom.participants, session?.user?.id]);

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
                <div className="flex w-full items-center">
                    {breakpoint == 'sm' && (
                        <Button
                            className="mr-2 rounded-xl p-2 text-2xl hover:bg-primary-1 dark:hover:bg-dark-primary-1"
                            variant={'custom'}
                            onClick={() => router.push('/messages')}
                        >
                            <Icons.ArrowBack />
                        </Button>
                    )}

                    {isGroup ? (
                        <Avatar
                            imgSrc={avatar}
                            alt={title}
                            width={40}
                            height={40}
                        />
                    ) : (
                        <Avatar
                            imgSrc={avatar}
                            alt={title}
                            width={40}
                            height={40}
                            userUrl={partner?._id}
                        />
                    )}

                    <div className="ml-2 flex flex-col">
                        <h3 className="text-mdfont-bold">{title}</h3>

                        {partner && (
                            <>
                                <span className="text-xs">
                                    {partner.isOnline ? (
                                        'Đang hoạt động'
                                    ) : (
                                        <>
                                            Hoạt động{' '}
                                            {partner?.lastAccessed
                                                ? timeConvert3(
                                                      partner.lastAccessed.toString(),
                                                      'trước'
                                                  )
                                                : 'vừa xong'}
                                        </>
                                    )}
                                </span>
                            </>
                        )}

                        {isGroup && (
                            <div className="md:max-w-[300px] sm:max-w-[150px]">
                                <span className="block truncate text-xs">
                                    {currentRoom.group?.name}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex w-full items-center justify-end">
                    <Button
                        className={cn(
                            'rounded-xl p-2 hover:bg-primary-1 dark:hover:bg-dark-primary-1',
                            {
                                'bg-primary-1 dark:bg-dark-primary-1':
                                    openSearch,
                            }
                        )}
                        variant={'custom'}
                        onClick={handleOpenSearch}
                    >
                        <Icons.Search size={24} />
                    </Button>

                    <Button
                        className={cn(
                            'rounded-xl p-2 hover:bg-primary-1 dark:hover:bg-dark-primary-1',
                            {
                                'bg-primary-1 dark:bg-dark-primary-1': openInfo,
                            }
                        )}
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
