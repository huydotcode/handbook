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

    if (!conversations) return null;

    return (
        <>
            <div
                className={cn(
                    'mr-2 flex h-full w-[300px] min-w-[80px] flex-col overflow-hidden rounded-xl bg-secondary-1 shadow-xl transition-all duration-500 dark:bg-dark-secondary-1 dark:shadow-none lg:w-[80px]'
                )}
            >
                <div className="px-4 py-2">
                    <h1 className="text-2xl font-bold lg:hidden">Trò chuyện</h1>

                    <SearchConversation
                        initConversations={initConversations}
                        setConversations={setConversations}
                    />
                </div>

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
