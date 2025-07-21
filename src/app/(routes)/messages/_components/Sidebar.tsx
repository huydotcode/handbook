'use client';
import { Icons, Loading } from '@/components/ui';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '@/components/ui/select';
import { useConversations } from '@/context/SocialContext';
import { cn } from '@/lib/utils';
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
    type: 'all' | 'unread' | 'read' | 'archived' | 'deleted';
};

const Sidebar: React.FC<Props> = ({}) => {
    const { data: session } = useSession();
    const { data: initConversations, isLoading } = useConversations(
        session?.user?.id
    );
    const [filter, setFilter] = useState<IFilterConversation>({
        query: '',
        type: 'all',
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
        console.log('Conversations:', conversations);
    }, [conversations]);

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
                                    type: value.split('-')[1] as
                                        | 'all'
                                        | 'unread'
                                        | 'read'
                                        | 'archived'
                                        | 'deleted',
                                    sortBy: value
                                        .split('-')[0]
                                        .replace('sort-', ''),
                                    sortOrder: value.includes('desc')
                                        ? 'desc'
                                        : 'asc',
                                }));
                            }}
                        >
                            <SelectTrigger className="mt-2 h-8 w-fit max-w-[150px] bg-secondary-2 text-xs dark:bg-dark-secondary-2">
                                <div className="flex items-center pr-2">
                                    <Icons.Filter className="h-4 w-4" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className="text-xs">
                                        Lọc theo
                                    </SelectLabel>
                                    <SelectItem value="filter-all">
                                        Tất cả
                                    </SelectItem>
                                    <SelectItem value="filter-unread">
                                        Chưa đọc
                                    </SelectItem>
                                    <SelectItem value="filter-read">
                                        Đã đọc
                                    </SelectItem>
                                    <SelectItem value="filter-archived">
                                        Đã lưu trữ
                                    </SelectItem>
                                    <SelectItem value="filter-deleted">
                                        Đã xóa
                                    </SelectItem>
                                </SelectGroup>

                                <SelectGroup>
                                    <SelectLabel className="text-xs">
                                        Sắp xếp theo
                                    </SelectLabel>
                                    <SelectItem value="sort-createdAt">
                                        Ngày tạo
                                    </SelectItem>
                                    <SelectItem value="sort-title">
                                        Tên
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoading && <Loading text="Đang tải cuộc trò chuyện..." />}

                <div className="flex flex-col gap-1 overflow-y-auto pb-10">
                    {!isLoading &&
                        conversations &&
                        conversations
                            .filter((conversation) => {
                                if (filter.type === 'all') return true;
                                if (filter.type === 'unread') {
                                    return conversation.lastMessage?.readBy
                                        ? !conversation.lastMessage.readBy.some(
                                              (read) =>
                                                  read.user._id ===
                                                  session?.user.id
                                          )
                                        : false;
                                }
                                if (filter.type === 'read') {
                                    return false;
                                }
                                if (filter.type === 'archived') {
                                    // return conversation.isArchived;
                                    return false;
                                }
                                if (filter.type === 'deleted') {
                                    return conversation.isDeletedBy.some(
                                        (userId) => userId === session?.user.id
                                    );
                                }
                                return true;
                            })
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
                </div>

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
