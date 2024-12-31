'use client';
import SearchMessage from '@/app/(routes)/messages/_components/SearchMessage';
import { Button, Icons } from '@/components/ui';
import { useSocket } from '@/context';
import { useLastMessage, useMessages } from '@/context/SocialContext';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React, {
    KeyboardEventHandler,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import ChatHeader from './ChatHeader';
import InfomationConversation from './InfomationConversation';
import InputMessage from './InputMessage';
import Message from './Message';

interface Props {
    className?: string;
    conversation: IConversation;
}

const ChatBox: React.FC<Props> = ({ className, conversation }) => {
    const {
        data: messages,
        fetchNextPage,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
    } = useMessages(conversation._id);
    const { data: session } = useSession();
    if (!session) return null;

    const { socketEmitor } = useSocket();
    const { data: lastMessage } = useLastMessage(conversation._id);
    const { ref: topRef, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const handleOpenSearch = () => {
        setOpenSearch(true);
    };

    // Xử lý nhấn Esc để đóng khung tìm kiếm
    const handleKeyDownEsc: KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === 'Escape' && openSearch) {
            setOpenSearch(false);
        }
    };

    // Cuộn xuống dưới cùng
    const handleScrollDown = () => {
        if (!bottomRef.current) return;
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    // Xử lý đọc tin nhắn
    useEffect(() => {
        if (!session?.user?.id) return;

        if (!lastMessage) return;
        if (lastMessage.isRead) return;
        if (lastMessage.sender._id !== session?.user?.id) {
            socketEmitor.readMessage({
                roomId: conversation._id,
                userId: session?.user.id,
            });
        }
    }, [lastMessage]);

    // Kiểm tra nếu đang ở bottomRef thì không hiển thị nút scroll down
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowScrollDown(!entry.isIntersecting);
            },
            {
                threshold: 1,
            }
        );

        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [bottomRef.current]);

    return (
        <>
            <div
                className={cn(
                    'relative flex h-full w-full flex-1 flex-col rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none',
                    className,
                    openInfo && 'md:hidden'
                )}
                onKeyDown={handleKeyDownEsc}
            >
                <ChatHeader
                    currentRoom={conversation}
                    setOpenInfo={setOpenInfo}
                    handleOpenSearch={handleOpenSearch}
                />

                <div className="relative h-[calc(100vh-112px)] w-full overflow-y-auto overflow-x-hidden p-2 ">
                    {openSearch && (
                        <SearchMessage setOpenSearch={setOpenSearch} />
                    )}

                    {isFetchingNextPage && (
                        <div className="absolute left-1/2 -translate-x-1/2 text-3xl">
                            <Icons.Loading />
                        </div>
                    )}

                    {isLoading && (
                        <div className="absolute left-1/2 -translate-x-1/2 text-3xl">
                            <Icons.Loading />
                        </div>
                    )}

                    <div className="relative flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden border-b px-1 pb-2">
                        <div ref={bottomRef} />

                        {messages?.map((message) => (
                            <Message
                                key={message._id}
                                data={message}
                                messages={messages}
                            />
                        ))}

                        {hasNextPage && <div className="py-2" ref={topRef} />}
                    </div>
                </div>

                <div className="relative flex w-full justify-center">
                    {showScrollDown && (
                        <Button
                            className={cn(
                                'absolute -top-12 left-1/2 z-50 w-fit -translate-x-1/2 opacity-30 transition-all duration-300 hover:opacity-100'
                            )}
                            onClick={handleScrollDown}
                        >
                            <Icons.ArrowDown className="h-4 w-4" />
                        </Button>
                    )}

                    <InputMessage currentRoom={conversation} />
                </div>
            </div>

            {openInfo && (
                <InfomationConversation
                    conversation={conversation}
                    openInfo={openInfo}
                    setOpenInfo={setOpenInfo}
                />
            )}
        </>
    );
};

export default ChatBox;
