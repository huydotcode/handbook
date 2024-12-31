'use client';
import { useConversations } from '@/context/SocialContext';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import ConversationItem from './item/ConversationItem';
import SearchConversation from './SearchConversation';

interface Props {}

const Sidebar: React.FC<Props> = ({}) => {
    const { data: session } = useSession();
    if (!session) return null;
    const { data: initConversations } = useConversations(session?.user?.id);
    const [filter, setFilter] = useState<string>('');

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

    useEffect(() => {
        console.log({
            initConversations,
        });
    }, [initConversations]);

    return (
        <>
            <div
                className={cn(
                    'mr-2 flex h-full w-[300px] min-w-[80px] flex-col overflow-hidden rounded-xl bg-secondary-1 shadow-xl transition-all duration-500 dark:bg-dark-secondary-1 dark:shadow-none lg:w-[80px]'
                )}
            >
                <div className="px-4 py-2">
                    <h1 className="text-2xl font-bold lg:hidden">Trò chuyện</h1>

                    <SearchConversation setFilter={setFilter} />
                </div>

                {initConversations &&
                    initConversations.map((conversation: IConversation) => {
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
