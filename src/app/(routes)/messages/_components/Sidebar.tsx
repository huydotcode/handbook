'use client';
import { useConversations } from '@/context/SocialContext';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import ConversationItem from './ConversationItem';
import SearchConversation from './SearchConversation';
import { Loading } from '@/components/ui';

interface Props {}

const Sidebar: React.FC<Props> = ({}) => {
    const { data: session } = useSession();
    const { data: initConversations, isLoading } = useConversations(
        session?.user?.id
    );
    const [filter, setFilter] = useState<string>('');

    const pathName = usePathname();
    const isMessagesPage = pathName === '/messages';

    const conversations =
        filter.trim().length > 0
            ? initConversations?.filter((conversation) => {
                  return (
                      conversation.participants
                          .filter((user) => user._id !== session?.user.id)
                          .find((user) =>
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
            <aside
                className={cn(
                    'fixed left-0 top-0 z-10 mr-2 flex h-[calc(100vh-56px)] w-[300px] min-w-[80px] flex-col overflow-hidden bg-secondary-1 shadow-xl transition-all duration-500 dark:bg-dark-secondary-1 dark:shadow-none lg:w-[80px] sm:w-full',
                    !isMessagesPage && 'sm:hidden'
                )}
            >
                <div className="px-4 py-2">
                    <h1 className="text-2xl font-bold lg:hidden sm:block">
                        Trò chuyện
                    </h1>

                    <SearchConversation setFilter={setFilter} />
                </div>

                {isLoading && <Loading text="Đang tải cuộc trò chuyện..." />}

                {!isLoading &&
                    conversations &&
                    conversations.map((conversation: IConversation) => {
                        return (
                            <ConversationItem
                                data={conversation}
                                key={conversation._id}
                            />
                        );
                    })}

                {!isLoading && conversations && conversations.length === 0 && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Không có cuộc trò chuyện nào
                    </p>
                )}
            </aside>
        </>
    );
};
export default Sidebar;
