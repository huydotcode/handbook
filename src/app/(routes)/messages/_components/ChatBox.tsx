'use client';
import SearchMessage from '@/app/(routes)/messages/_components/SearchMessage';
import { Button, Icons } from '@/components/ui';
import { useSocket } from '@/context';
import { useLastMessage } from '@/context/SocialContext';
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
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getMessagesKey } from '@/lib/queryKey';

interface Props {
    className?: string;
    conversation: IConversation;
    findMessage?: IMessage;
}

const ChatBox: React.FC<Props> = ({ className, conversation, findMessage }) => {
    const pageSize = 50;
    const conversationId = conversation._id;
    const [isFind, setIsFind] = useState<boolean>(false);
    const {
        data: messages,
        fetchNextPage,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: getMessagesKey(conversationId),
        queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
            if (!conversationId) return [];

            const res = await fetch(
                `/api/messages?conversationId=${conversationId}&page=${pageParam}&pageSize=${pageSize}`
            );
            const messages = await res.json();
            return messages;
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === pageSize ? pages.length + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!conversationId,
        select: (data) => {
            return data.pages.flatMap((page) => page) as IMessage[];
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
    const { data: session } = useSession();
    if (!session) return null;

    const { socketEmitor } = useSocket();
    const { data: lastMessage } = useLastMessage(conversation._id);
    const { ref: topRef, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });
    const topRef2 = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const lastMessageRef = useRef<HTMLDivElement>(null);

    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement>(null);

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

    const handleOpenSearch = () => {
        setOpenInfo(false);
        setOpenSearch((prev) => !prev);
    };

    const handleOpenInfo = () => {
        setOpenSearch(false);
        setOpenInfo((prev) => !prev);
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

    useEffect(() => {
        setIsFind(false);
    }, [findMessage]);

    useEffect(() => {
        if (findMessage && !isFind && messages && !isFetchingNextPage) {
            const handleFindMessage = async () => {
                // Vòng lặp fetch cho đến khi tìm thấy hoặc hết trang

                // Tìm tin nhắn trong dữ liệu hiện có
                const foundMessage = messages.find(
                    (message) => message._id === findMessage._id
                );

                if (foundMessage) {
                    // Tìm thấy

                    document.getElementById(foundMessage._id)?.scrollIntoView({
                        behavior: 'smooth',
                    });
                    setIsFind(true); // Đánh dấu tìm thấy
                    return;
                }

                if (hasNextPage) {
                    // Nếu không tìm thấy, fetch trang tiếp theo
                    await fetchNextPage();
                }

                if (!hasNextPage) {
                    toast.error('Không tìm thấy tin nhắn', {
                        position: 'top-center',
                    });
                }
            };

            handleFindMessage();
        }
    }, [
        findMessage,
        messages,
        fetchNextPage,
        hasNextPage,
        isFind,
        pageSize,
        isFetchingNextPage,
    ]);

    // Scroll tới tin nhắn cuối cùng
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }, [lastMessage]);

    return (
        <>
            <div
                className={cn(
                    'relative flex h-full w-full flex-1 flex-col rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none',
                    className,
                    openInfo && 'md:hidden',
                    openSearch && 'md:hidden'
                )}
                onKeyDown={handleKeyDownEsc}
            >
                <ChatHeader
                    currentRoom={conversation}
                    handleOpenInfo={handleOpenInfo}
                    handleOpenSearch={handleOpenSearch}
                />

                <div className="relative h-[calc(100vh-112px)] w-full overflow-y-auto overflow-x-hidden p-2 ">
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

                    <div className="relative flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden border-b px-1 pb-2 md:max-h-[calc(100%-58px)]">
                        <div ref={bottomRef} />

                        {messages?.map((message) => (
                            <Message
                                key={message._id}
                                data={message}
                                messages={messages}
                                searchMessage={findMessage}
                                isLastMessage={lastMessage?._id === message._id}
                            />
                        ))}

                        {hasNextPage && <div className="py-2" ref={topRef} />}
                        {hasNextPage && <div className="py-2" ref={topRef2} />}
                    </div>

                    {findMessage && (
                        <Button
                            className={cn(
                                'absolute left-1/2 top-4 -translate-x-1/2'
                            )}
                            variant={'secondary'}
                            onClick={() => {
                                router.push(`/messages/${conversation._id}`);
                                setOpenSearch(false);
                            }}
                        >
                            Thoát tìm kiếm
                        </Button>
                    )}
                </div>

                <div className="relative flex justify-center">
                    {showScrollDown && (
                        <Button
                            className={cn(
                                'absolute -top-12 left-1/2 z-50 w-fit -translate-x-1/2 opacity-30 transition-all duration-300 hover:opacity-100 md:-top-[7rem]'
                            )}
                            onClick={handleScrollDown}
                        >
                            <Icons.ArrowDown className="h-4 w-4" />
                        </Button>
                    )}

                    <InputMessage currentRoom={conversation} />
                </div>
            </div>

            {openInfo && messages && (
                <InfomationConversation
                    messages={messages}
                    conversation={conversation}
                    setOpenInfo={setOpenInfo}
                />
            )}

            <SearchMessage
                openSearch={openSearch}
                conversationId={conversation._id}
                setOpenSearch={setOpenSearch}
            />
        </>
    );
};

export default ChatBox;
