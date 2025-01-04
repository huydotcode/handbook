'use client';
import { useConversations } from '@/context/SocialContext';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import ConversationItem from './ConversationItem';
import SearchConversation from './SearchConversation';

interface Props {}

const Sidebar: React.FC<Props> = ({}) => {
    const { data: session } = useSession();
    const { data: initConversations } = useConversations(session?.user?.id);
    const [filter, setFilter] = useState<string>('');

    const pathName = usePathname();
    const isMessagesPage = pathName === '/messages';

    const conversations =
        filter.trim().length > 0
            ? initConversations?.filter((conversation) => {
                  return (
                      conversation.participants.find((user) =>
                          user.name
                              .toLocaleLowerCase()
                              .includes(filter.toLocaleLowerCase())
                      ) ||
                      conversation.title
                          .toLocaleLowerCase()
                          .includes(filter.toLocaleLowerCase())
                  );
              })
            : initConversations;

    return (
        <>
            <div
                className={cn(
                    'fixed left-0 z-10 mr-2 flex h-[calc(100vh-72px)] w-[300px] min-w-[80px] flex-col overflow-hidden rounded-xl bg-secondary-1 shadow-xl transition-all duration-500 dark:bg-dark-secondary-1 dark:shadow-none lg:w-[80px] sm:w-full',
                    !isMessagesPage && 'sm:hidden'
                )}
            >
                <div className="px-4 py-2">
                    <h1 className="text-2xl font-bold lg:hidden sm:block">
                        Trò chuyện
                    </h1>

                    <SearchConversation setFilter={setFilter} />
                </div>

                {conversations &&
                    conversations.map((conversation: IConversation) => {
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
