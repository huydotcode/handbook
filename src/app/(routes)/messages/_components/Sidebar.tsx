'use client';
import { Icons, Loading } from '@/components/ui';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { useConversations } from '@/context/SocialContext';
import { cn } from '@/lib/utils';
import { SelectValue } from '@radix-ui/react-select';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ConversationItem from './ConversationItem';
import SearchConversation from './SearchConversation';

interface Props {}

export type IFilterConversation = {
    query: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
};

const Sidebar: React.FC<Props> = ({}) => {
    const { data: session } = useSession();
    const { data: initConversations, isLoading } = useConversations(
        session?.user?.id
    );
    const [filter, setFilter] = useState<IFilterConversation>({
        query: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const pathName = usePathname();
    const isMessagesPage = pathName === '/messages';

    const conversations = initConversations?.filter((conversation) => {
        const isParticipant = conversation.participants.some(
            (user) => user._id === session?.user.id
        );

        const isDeletedByUser =
            conversation.isDeletedBy.some(
                (userId) => userId === session?.user.id
            ) || false;

        return (
            isParticipant &&
            !isDeletedByUser &&
            conversation.participants.length > 0
        );
    });

    useEffect(() => {
        console.log({
            filter,
        });
    }, [filter]);

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

                    <div className="flex items-center justify-end">
                        <Select
                            onValueChange={(value) => {
                                setFilter((prev) => ({
                                    ...prev,
                                    sortBy: value,
                                    sortOrder:
                                        value === prev.sortBy
                                            ? prev.sortOrder === 'asc'
                                                ? 'desc'
                                                : 'asc'
                                            : 'desc',
                                }));
                            }}
                        >
                            <SelectTrigger className="mt-2 h-8 max-w-[150px] bg-secondary-2 text-xs md:w-fit">
                                <div className="flex items-center md:hidden">
                                    <SelectValue placeholder="Sắp xếp theo" />
                                </div>
                                <div className="hidden items-center md:flex">
                                    <Icons.Sort className="h-4 w-4" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">
                                    Ngày tạo
                                </SelectItem>
                                <SelectItem value="title">Tên</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoading && <Loading text="Đang tải cuộc trò chuyện..." />}

                {!isLoading &&
                    conversations &&
                    conversations
                        .sort((a, b) => {
                            if (filter.sortBy === 'createdAt') {
                                return filter.sortOrder === 'desc'
                                    ? new Date(b.createdAt).getTime() -
                                          new Date(a.createdAt).getTime()
                                    : new Date(a.createdAt).getTime() -
                                          new Date(b.createdAt).getTime();
                            } else if (filter.sortBy === 'title') {
                                return filter.sortOrder === 'asc'
                                    ? a.title.localeCompare(b.title)
                                    : b.title.localeCompare(a.title);
                            }
                            return 0;
                        })
                        .map((conversation: IConversation) => {
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
