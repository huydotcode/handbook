import { Avatar, Button, Icons } from '@/components/ui';
import { Collapse, Tooltip } from '@mui/material';
import { CollapseProps } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useMemo } from 'react';

interface Props {
    conversation: IConversation;
}

const InfomationConversation: React.FC<Props> = ({ conversation }) => {
    const { data: session } = useSession();

    const partner = useMemo(() => {
        if (conversation.group) {
            return null;
        } else {
            if (conversation.participants[0].user._id === session?.user?.id) {
                return conversation.participants[1].user;
            } else {
                return conversation.participants[0].user;
            }
        }
    }, [conversation]);

    const title = useMemo(() => {
        if (conversation.group) {
            return conversation.group.name;
        } else {
            return partner?.name;
        }
    }, [conversation]);

    const avatar = useMemo(() => {
        if (conversation.group) {
            return conversation.group.avatar;
        } else {
            return partner?.avatar;
        }
    }, [conversation]);

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Thành viên',
            children: (
                <div>
                    {conversation.participants.slice(0, 5).map((part) => (
                        <Button
                            className="flex items-center"
                            key={part._id}
                            href={`/profile/${part.user._id}`}
                        >
                            <Avatar
                                imgSrc={part.user.avatar}
                                width={24}
                                height={24}
                            />
                            <p className="ml-2 text-xs">{part.user.name}</p>
                        </Button>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <div className="relative ml-2 flex h-full min-w-[220px] flex-col rounded-xl bg-white p-4 shadow-xl dark:bg-dark-secondary-1 dark:shadow-none">
            <div className="flex flex-col items-center">
                <Avatar imgSrc={avatar} width={64} height={64} />
                <h1 className="mt-2">{title}</h1>
                {partner && (
                    <div>
                        <p className="text-center">
                            {partner.isOnline ? 'Online' : 'Offline'}
                        </p>

                        <div className="flex gap-2 pt-2">
                            <Tooltip title="Trang cá nhân">
                                <Button
                                    className="flex flex-col rounded-full"
                                    href={`/profile/${partner._id}`}
                                >
                                    <Icons.Profile size={24} />
                                </Button>
                            </Tooltip>

                            <Tooltip title="Tìm kiếm trong cuộc trò chuyện">
                                <Button
                                    className="flex flex-col rounded-full"
                                    href={`/profile/${partner._id}`}
                                >
                                    <Icons.Search size={24} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfomationConversation;
