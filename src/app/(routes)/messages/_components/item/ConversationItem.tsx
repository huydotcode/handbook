'use client';
import { Avatar, Button, Icons } from '@/components/ui';
import { useLastMessage } from '@/context/SocialContext';

import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

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
        <Button
            className={cn(
                'relative mx-4 flex justify-between rounded-xl px-4 py-2 shadow-none lg:justify-center',
                isSelect && 'bg-primary-1'
            )}
            href={`/messages/${conversation._id}`}
            key={conversation._id}
        >
            <div className="relative h-8 w-8">
                <div className="h-8 w-8">
                    {conversation.group ? (
                        <Avatar
                            onlyImage
                            imgSrc={conversation.group.avatar}
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

            <div className="flex flex-1 flex-col lg:hidden">
                <div className="flex items-center justify-between">
                    <h3 className="ml-2 whitespace-nowrap text-sm font-bold">
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
                            <span
                                className={cn(
                                    'dark:text-dark-primary-1',
                                    lastMessage?.sender._id == session?.user.id
                                        ? 'text-primary-1'
                                        : 'text-secondary-1'
                                )}
                            >
                                {lastMessage?.sender._id == session?.user.id
                                    ? 'Bạn: '
                                    : `${lastMessage?.sender.name}: `}
                            </span>

                            <span
                                className={cn('', {
                                    'font-bold': !lastMessage?.isRead,
                                    'font-normal text-secondary-1':
                                        lastMessage?.isRead,
                                })}
                            >
                                {lastMessage.text.trim().length > 0
                                    ? lastMessage.text
                                    : 'Đã gửi một ảnh'}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </Button>
    );
};

export default ConversationItem;
