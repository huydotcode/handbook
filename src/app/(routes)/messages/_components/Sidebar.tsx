'use client';
import { cn } from '@/lib/utils';
import generateRoomId from '@/utils/generateRoomId';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FriendChatItem } from '.';

interface Props {
    friends: IFriend[];
    conversations: IGroupConversation[];
}

const Sidebar: React.FC<Props> = ({ conversations, friends }) => {
    const { data: session } = useSession();
    const path = usePathname();

    if (!session) return null;

    const pathConversationId = path.split('/')[3];

    return (
        <>
            <div
                className={cn(
                    'mr-2 flex h-full w-[200px] flex-col overflow-hidden rounded-xl bg-secondary-1 shadow-xl transition-all duration-500 dark:bg-dark-secondary-1 dark:shadow-none md:w-fit'
                )}
            >
                <span className="h-[64px] border-b p-4 text-center text-xl font-bold dark:border-none md:hidden">
                    Bạn bè
                </span>

                {friends &&
                    friends.map((friend: IFriend) => {
                        return (
                            <FriendChatItem
                                data={friend}
                                key={friend._id}
                                isSelect={
                                    pathConversationId ===
                                    generateRoomId(session.user.id, friend._id)
                                }
                            />
                        );
                    })}

                {friends.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center">
                        <h5 className="mb-2 text-secondary-1">Chưa có bạn</h5>
                    </div>
                )}

                <span className="h-[64px] border-b p-4 text-center text-xl font-bold dark:border-none md:hidden">
                    Cuộc trò chuyện nhóm
                </span>

                {conversations &&
                    conversations.map((conversation: IGroupConversation) => {
                        return <div>{conversation.name}</div>;
                    })}
            </div>
        </>
    );
};
export default Sidebar;
