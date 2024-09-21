'use client';
import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';
import ConversationItem from './item/ConversationItem';

interface Props {
    conversations: IConversation[];
}

const Sidebar: React.FC<Props> = ({ conversations }) => {
    return (
        <>
            <div
                className={cn(
                    'mr-2 flex h-full w-[300px] flex-col overflow-hidden rounded-xl bg-secondary-1 shadow-xl transition-all duration-500 dark:bg-dark-secondary-1 dark:shadow-none md:w-[80px]'
                )}
            >
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
