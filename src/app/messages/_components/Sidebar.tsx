'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { FriendChatItem } from '.';

interface Props {
    friends: IFriend[];
    currentConversation?: IPrivateConversation;
}

const Sidebar: React.FC<Props> = ({ currentConversation, friends }) => {
    return (
        <>
            <div
                className={cn(
                    'mr-2 flex h-full w-[20%] flex-col rounded-xl bg-secondary-1 shadow-xl transition-all duration-500 dark:bg-dark-secondary-1 dark:shadow-none'
                )}
            >
                <span className="h-[64px] border-b p-4 text-center text-xl font-bold dark:border-none md:hidden">
                    Bạn bè
                </span>

                {friends &&
                    friends.map((friend: IFriend) => (
                        <FriendChatItem
                            data={friend}
                            key={friend._id}
                            isSelect={
                                currentConversation?.friend?._id === friend._id
                            }
                        />
                    ))}

                {friends.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center">
                        <h5 className="mb-2 text-secondary-1">Chưa có bạn</h5>
                    </div>
                )}
            </div>
        </>
    );
};
export default Sidebar;
