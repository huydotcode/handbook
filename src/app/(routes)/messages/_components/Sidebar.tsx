'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import ConversationItem from './item/ConversationItem';
import SearchConversation from './SearchConversation';

interface Props {
    conversations: IConversation[];
}

const Sidebar: React.FC<Props> = ({ conversations: initConversations }) => {
    const [conversations, setConversations] =
        useState<IConversation[]>(initConversations);

    return (
        <>
            <div
                className={cn(
                    'mr-2 flex h-full w-[300px] flex-col overflow-hidden rounded-xl bg-secondary-1 shadow-xl transition-all duration-500 dark:bg-dark-secondary-1 dark:shadow-none md:w-[80px]'
                )}
            >
                <SearchConversation
                    initConversations={initConversations}
                    setConversations={setConversations}
                />

                {conversations.map((conversation: IConversation) => {
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
