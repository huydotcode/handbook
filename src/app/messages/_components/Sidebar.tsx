'use client';
import { Button } from '@/components/ui';
import Icons from '@/components/ui/Icons';
import { useAppContext } from '@/context/AppContext';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import ConversationChatItem from './item/ConversationChatItem';
import FriendChatItem from './item/FriendChatItem';

interface Props {
    firstShow?: boolean;
}

const Sidebar: React.FC<Props> = ({ firstShow = true }) => {
    const { data: session } = useSession();
    const { friends } = useAppContext();
    const { currentRoom, loading, conversations } = useChat();
    const [showSidebar, setShowSidebar] = useState(firstShow);
    const [isHover, setIsHover] = useState(false);

    const handleToggleSidebar = () => {
        setShowSidebar((prev) => !prev);
    };

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
        }
    };

    useEffect(() => {
        if (window.innerWidth < 768) {
            setShowSidebar(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!session) return null;

    return (
        <>
            <Button
                className={cn(
                    'absolute left-1 top-16 z-20 hidden h-12 w-12 bg-white text-3xl transition-all duration-300 dark:bg-gray-800 dark:text-gray-300 md:block',
                    {
                        '-left-4 opacity-40': !isHover,
                        '-left-1': isHover,
                        block: !showSidebar,
                    }
                )}
                onClick={handleToggleSidebar}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {showSidebar ? <Icons.ArrowBack /> : <Icons.ArrowForward />}
            </Button>

            <div
                className={cn(
                    'left-0 top-[56px] z-10 flex min-h-[calc(100vh-56px-54px)] max-w-[300px] flex-col overflow-x-hidden border-r bg-white transition-all duration-500 dark:border-r-gray-600 dark:bg-dark-200 md:fixed',
                    {
                        'w-0  border-none': !showSidebar,
                        'w-[40%]': showSidebar,
                        'h-[calc(100vh-56px)]': !!!currentRoom.id,
                    }
                )}
            >
                <span className="border-b p-2 text-center text-xl font-bold">
                    Bạn bè
                </span>

                {friends &&
                    friends.map((friend: IFriend) => (
                        <FriendChatItem data={friend} key={friend._id} />
                    ))}

                {conversations && conversations.length > 0 && (
                    <>
                        <span className="border-b p-2 text-center text-xl font-bold">
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
                        <p className="max-w-[200px] text-gray-500">
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
