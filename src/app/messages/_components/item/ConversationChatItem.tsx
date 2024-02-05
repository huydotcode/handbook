'use client';
import { Avatar, Button } from '@/components/ui';
import { useChat } from '@/context/ChatContext';
import { useSession } from 'next-auth/react';
import React from 'react';

interface Props {
    data: IRoomChat;
}

const ConversationChatItem: React.FC<Props> = ({ data: conversation }) => {
    const { data: session } = useSession();
    const { currentRoom } = useChat();

    const otherUserId = conversation.id.replace(session?.user.id || '', '');

    const isSelect = currentRoom.id == conversation.id;

    return (
        <>
            <Button
                className={`flex h-[60px] w-full cursor-pointer items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-500 ${
                    isSelect && 'bg-gray-200 dark:bg-dark-500'
                }`}
                key={otherUserId}
                href={`/messages/r/${otherUserId}`}
                variant={'custom'}
            >
                <Avatar imgSrc={conversation.image} />

                <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                        <h3 className="ml-2 whitespace-nowrap text-sm font-bold">
                            {conversation.name}
                        </h3>
                    </div>
                </div>
            </Button>
        </>
    );
};
export default ConversationChatItem;
