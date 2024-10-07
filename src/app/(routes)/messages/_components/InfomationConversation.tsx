import { Avatar } from '@/components/ui';
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

    return (
        <div className="relative ml-2 flex h-full flex-col rounded-xl bg-white p-4 shadow-xl dark:bg-dark-secondary-1 dark:shadow-none">
            <div className="flex flex-col items-center">
                <Avatar imgSrc={avatar} width={64} height={64} />
                <h1>{title}</h1>
            </div>
        </div>
    );
};

export default InfomationConversation;
