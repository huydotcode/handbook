'use client';
import React, { useEffect } from 'react';
import ConversationItem from './item/ConversationItem';
import { cn } from '@/lib/utils';

interface Props {
    conversations: IConversation[];
}

const Sidebar: React.FC<Props> = ({ conversations }) => {
    useEffect(() => {
        console.log(conversations);
    }, [conversations]);

    return (
        <>
            <div
                className={cn(
                    'mr-2 flex h-full w-[300px] flex-col overflow-hidden rounded-xl bg-secondary-1 shadow-xl transition-all duration-500 dark:bg-dark-secondary-1 dark:shadow-none md:w-fit'
                )}
            >
                <span className="h-[64px] border-b p-4 text-center text-xl font-bold dark:border-none md:hidden">
                    Bạn bè
                </span>
                {conversations
                    .filter((con) => !con.group)
                    .map((conversation: IConversation) => {
                        return (
                            <ConversationItem
                                data={conversation}
                                key={conversation._id}
                            />
                        );
                    })}
                {/* {privateConversations.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center">
                        <h5 className="mb-2 text-secondary-1">Chưa có bạn</h5>
                    </div>
                )} */}
                <span className="h-[64px] border-b p-4 text-center text-xl font-bold dark:border-none md:hidden">
                    Cuộc trò chuyện nhóm
                </span>
                {conversations
                    .filter((con) => con.group)
                    .map((conversation: IConversation) => {
                        return (
                            <ConversationItem
                                data={conversation}
                                key={conversation._id}
                            />
                        );
                    })}
            </div>
        </>
    );
};
export default Sidebar;
