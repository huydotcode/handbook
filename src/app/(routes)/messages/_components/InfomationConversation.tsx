import { Avatar, Button, Icons } from '@/components/ui';
import { Tooltip } from '@mui/material';
import { Collapse, CollapseProps } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useMemo } from 'react';
import { Items } from '@/components/shared';

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
                        <Items.User
                            className={'h-10 text-xs'}
                            data={part.user}
                            key={part._id}
                        />
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
                        </div>
                    </div>
                )}

                <Collapse
                    className={'mt-2 w-full bg-transparent'}
                    items={items}
                    bordered={false}
                />
            </div>
        </div>
    );
};

export default InfomationConversation;
