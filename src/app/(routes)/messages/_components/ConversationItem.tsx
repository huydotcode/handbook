'use client';
import { Avatar, Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useLastMessage } from '@/context/SocialContext';

import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { splitName } from '@/utils/splitName';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { timeConvert, timeConvert3 } from '@/utils/timeConvert';

interface Props {
    data: IConversation;
}

const ConversationItem: React.FC<Props> = ({ data: conversation }) => {
    const { data: session } = useSession();
    const { data: lastMessage } = useLastMessage(conversation._id);
    const path = usePathname();

    const partner = useMemo(() => {
        return conversation.group
            ? null
            : conversation.participants.find((p) => p._id !== session?.user.id);
    }, [conversation, session]);

    const isSelect = useMemo(() => {
        return path.includes(conversation._id);
    }, [path, conversation._id]);

    const title = useMemo(() => {
        if (partner) return partner.name;
        if (conversation.title) return conversation.title;
        if (conversation.group) return conversation.group.name;
    }, [conversation, partner]);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Button
                        className={cn(
                            'relative mx-4 flex justify-between px-4 shadow-none lg:justify-center',
                            isSelect && 'bg-primary-1'
                        )}
                        href={`/messages/${conversation._id}`}
                        key={conversation._id}
                        size={'2xl'}
                    >
                        <div className="relative h-8 w-8">
                            <div className="h-8 w-8">
                                {conversation.group ? (
                                    <Avatar
                                        onlyImage
                                        imgSrc={conversation.group.avatar.url}
                                        alt={conversation.group.name}
                                    />
                                ) : (
                                    <Avatar
                                        onlyImage
                                        imgSrc={partner?.avatar}
                                        alt={partner?.name}
                                    />
                                )}
                            </div>
                            {partner && (
                                <span className="absolute -right-1 bottom-0 ml-2 text-xs lg:right-4">
                                    <Icons.Circle
                                        className={`${partner?.isOnline ? 'text-primary-2' : 'text-secondary-1'}`}
                                    />
                                </span>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col lg:hidden sm:flex">
                            <div className="flex items-center justify-between">
                                <h3 className="ml-2 whitespace-nowrap text-sm font-bold text-primary-1 dark:text-dark-primary-1">
                                    {title}
                                </h3>
                            </div>
                            <div className="ml-2 max-w-full overflow-ellipsis whitespace-nowrap text-start text-xs">
                                {!lastMessage ? (
                                    <span className="text-secondary-1">
                                        Chưa có tin nhắn
                                    </span>
                                ) : (
                                    <>
                                        <div
                                            className={
                                                'flex items-center justify-between'
                                            }
                                        >
                                            <div
                                                className={
                                                    'flex items-center justify-between'
                                                }
                                            >
                                                <span
                                                    className={cn(
                                                        'text-secondary-1 dark:text-dark-primary-1'
                                                    )}
                                                >
                                                    {lastMessage?.sender._id ==
                                                    session?.user.id
                                                        ? 'Bạn: '
                                                        : `${splitName(lastMessage?.sender.name).lastName}: `}
                                                </span>

                                                <span
                                                    className={cn('ml-1', {
                                                        'font-bold':
                                                            !lastMessage?.isRead &&
                                                            lastMessage.sender
                                                                ._id !==
                                                                session?.user
                                                                    .id,
                                                        'font-normal text-secondary-1':
                                                            lastMessage.sender
                                                                ._id ==
                                                            session?.user.id,
                                                    })}
                                                >
                                                    {lastMessage.text.trim()
                                                        .length > 0
                                                        ? lastMessage.text
                                                              .slice(0, 8)
                                                              .concat('...')
                                                        : 'Gửi một ảnh'}
                                                </span>
                                            </div>

                                            {lastMessage.createdAt && (
                                                <span
                                                    className={cn('ml-2', {
                                                        'font-bold':
                                                            !lastMessage?.isRead &&
                                                            lastMessage.sender
                                                                ._id !==
                                                                session?.user
                                                                    .id,
                                                        'font-normal text-secondary-1':
                                                            lastMessage.sender
                                                                ._id ==
                                                            session?.user.id,
                                                    })}
                                                >
                                                    {timeConvert3(
                                                        lastMessage.createdAt.toString(),
                                                        'trước'
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ConversationItem;
