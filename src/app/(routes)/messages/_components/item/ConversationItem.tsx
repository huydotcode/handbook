'use client';
import { Avatar, Button, Icons } from '@/components/ui';
import { useChat } from '@/context';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface Props {
    data: IConversation;
}

const ConversationItem: React.FC<Props> = ({ data: conversation }) => {
    const { data: session } = useSession();
    const path = usePathname();
    const { lastMessages } = useChat();

    const lastMsg = lastMessages[conversation._id];

    const partner = useMemo(() => {
        return conversation.group
            ? null
            : conversation.participants.find(
                  (participant) => participant.user._id !== session?.user.id
              )?.user;
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
                            imgSrc={conversation.group.avatar}
                            alt={conversation.group.name}
                        />
                    ) : (
                        <Avatar imgSrc={partner?.avatar} alt={partner?.name} />
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
                    {!lastMsg ? (
                        <span className="text-secondary-1">
                            Chưa có tin nhắn
                        </span>
                    ) : (
                        <>
                            <span
                                className={cn(
                                    'dark:text-dark-primary-1',
                                    lastMsg?.sender._id == session?.user.id
                                        ? 'text-primary-1'
                                        : 'text-secondary-1'
                                )}
                            >
                                {lastMsg?.sender._id == session?.user.id
                                    ? 'Bạn: '
                                    : `${lastMsg?.sender.name}: `}
                            </span>
                            <span
                                className={cn('', {
                                    'font-bold': !lastMsg?.isRead,
                                    'text-secondary-1': lastMsg?.isRead,
                                })}
                            >
                                {lastMsg?.text.trim().length > 0
                                    ? lastMsg?.text
                                    : 'Đã gửi một hình ảnh'}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </Button>
    );
};

export default ConversationItem;
