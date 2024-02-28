'use client';
import { useApp } from '@/context';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React from 'react';
import { ConversationChatItem, FriendChatItem } from '.';

interface Props {}

const Sidebar: React.FC<Props> = () => {
    const { data: session } = useSession();
    const { friends } = useApp();
    const { currentRoom, loading, conversations } = useChat();
    if (!session) return null;

    return (
        <>
            <div
                className={cn(
                    'z-10 flex h-[calc(100vh-56px-54px)] w-[200px] flex-col overflow-x-hidden border-r bg-white transition-all duration-500 dark:border-dark-secondary-2 dark:bg-dark-secondary-1 md:w-[80px]',
                    {
                        'h-[calc(100vh-56px)]': !!!currentRoom.id,
                    }
                )}
            >
                <span className="h-[64px] border-b p-2 text-center text-xl font-bold dark:border-none">
                    Bạn bè
                </span>

                {friends &&
                    friends.map((friend: IFriend) => (
                        <FriendChatItem data={friend} key={friend._id} />
                    ))}

                {conversations && conversations.length > 0 && (
                    <>
                        <span className="border-b p-2 text-center text-xl font-bold dark:border-none">
                            Người lạ
                        </span>

                        {conversations.map((conversation: IRoomChat) => (
                            <ConversationChatItem
                                data={conversation}
                                key={conversation.id}
                            />
                        ))}
                    </>
                )}

                {!loading.friends && friends.length === 0 && (
                    <div className="flex h-full items-center justify-center p-4 text-justify">
                        <p className="max-w-[200px] md:hidden">
                            Bạn chưa có bạn bè nào, hãy thêm bạn bè để bắt đầu
                            trò chuyện
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};
export default Sidebar;
