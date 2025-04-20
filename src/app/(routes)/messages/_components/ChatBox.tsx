'use client';
import SearchMessage from '@/app/(routes)/messages/_components/SearchMessage';
import { FileUploaderWrapper } from '@/components/shared/FileUploader';
import { Icons, Loading } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSocket } from '@/context';
import { useLastMessage } from '@/context/SocialContext';
import useBreakpoint from '@/hooks/useBreakpoint';
import { sendMessage } from '@/lib/actions/message.action';
import axiosInstance from '@/lib/axios';
import { getMessagesKey } from '@/lib/queryKey';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, {
    KeyboardEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import ChatHeader from './ChatHeader';
import InfomationConversation from './InfomationConversation';
import InputMessage from './InputMessage';
import Message from './Message';

interface Props {
    className?: string;
    conversation: IConversation;
    findMessage?: string;
}

const PAGE_SIZE = 30;

export const useMessages = (conversationId: string) => {
    return useInfiniteQuery({
        queryKey: getMessagesKey(conversationId),
        queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
            if (!conversationId) return [];

            const res = await axiosInstance.get('/message', {
                params: {
                    conversation_id: conversationId,
                    page: pageParam,
                    page_size: PAGE_SIZE,
                },
            });

            return res.data || [];
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!conversationId,
        select: (data) => {
            return data.pages.flatMap((page) => page) as IMessage[];
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });
};

const ChatBox: React.FC<Props> = ({ className, conversation, findMessage }) => {
    const { data: session } = useSession();
    const { socketEmitor } = useSocket();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { breakpoint } = useBreakpoint();

    // Data messages && pinnedMessages && lastMessages
    const {
        data: messages,
        fetchNextPage,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
    } = useMessages(conversation._id);
    const { data: lastMessage } = useLastMessage(conversation._id);

    // Pinned messages
    const pinnedMessages = useMemo(() => {
        return (messages && messages.filter((msg) => msg.isPin)) || [];
    }, [messages]);

    // Group messages
    const groupedMessages = useMemo(() => {
        if (!messages) return {};
        return messages.reduce(
            (acc: { [key: string]: IMessage[] }, message) => {
                // Date type: DD/MM/YYYY
                const date = new Date(message.createdAt).toLocaleDateString(
                    'vi-VN',
                    {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    }
                );

                if (!acc[date]) acc[date] = [];
                acc[date].push(message);
                return acc;
            },
            {}
        );
    }, [messages]);

    // State UI
    const { ref: topRef, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });
    const [isFind, setIsFind] = useState<boolean>(false);
    const [isShowAllPinMessages, setIsShowAllPinMessages] =
        useState<boolean>(false);
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
    const [showPinMessages, setShowPinMessages] = useState<boolean>(false);

    // Ref UI
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Xử lý tải ảnh lên khi kéo thả
    const handleChangeUploadFile = async (files: File[]) => {
        try {
            toast.loading('Đang tải ảnh lên...', {
                id: 'uploadImages',
                duration: 3000,
            });

            const images = await uploadImagesWithFiles({
                files,
            });

            await sendMessage({
                roomId: conversation._id,
                text: '',
                images,
            });

            await queryClient.invalidateQueries({
                queryKey: getMessagesKey(conversation._id),
            });
        } catch (error) {
            toast.error('Đã có lỗi xảy ra');
        }
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

    // Xử lý mở khung tìm kiếm
    const handleOpenSearch = () => {
        setOpenInfo(false);
        setOpenSearch((prev) => !prev);
    };

    // Xử ly mở khung thông tin
    const handleOpenInfo = () => {
        setOpenSearch(false);
        setOpenInfo((prev) => !prev);
    };

    // Xử lý mở tin nhắn tìm kiếm
    const handleFindMessage = useCallback(
        async (messageId: string) => {
            if (!findMessage || !messages) return;

            // Tìm tin nhắn trong dữ liệu hiện có
            const foundMessage = messages.find((msg) => msg._id === messageId);

            if (foundMessage) {
                // Tìm thấy thì scroll tới tin nhắn đó
                const element = document.getElementById(messageId);

                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else {
                    const observer = new MutationObserver(() => {
                        const newElement = document.getElementById(messageId);

                        if (newElement) {
                            newElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                            });
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                }
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
        },
        [messages, fetchNextPage, hasNextPage, findMessage]
    );

    // Render tin nhắn ghim
    const renderPinnedMessasges = () => {
        return (
            <>
                {pinnedMessages.length > 0 && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className={
                                        'absolute right-0 top-0 z-20 h-8 px-2'
                                    }
                                    variant={'secondary'}
                                    onClick={() => {
                                        setShowPinMessages((prev) => !prev);
                                    }}
                                >
                                    {showPinMessages ? (
                                        <Icons.ArrowUp />
                                    ) : (
                                        <Icons.ArrowDown />
                                    )}
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent>
                                Hiển thị tin nhắn ghim
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                {showPinMessages && (
                    <div
                        className={
                            'absolute top-2 z-10 w-[90%] rounded-xl bg-primary-1 p-2 shadow-xl dark:bg-dark-secondary-1 dark:shadow-none'
                        }
                    >
                        <span className={'flex items-center text-sm'}>
                            <Icons.Pin className={'mr-2'} /> Tin nhắn ghim
                        </span>

                        <div className="mt-2 flex flex-col-reverse">
                            {pinnedMessages.length > 1 && (
                                <Button
                                    size={'xs'}
                                    variant={'text'}
                                    onClick={() =>
                                        setIsShowAllPinMessages((prev) => !prev)
                                    }
                                >
                                    {isShowAllPinMessages
                                        ? 'Thu gọn'
                                        : 'Xem thêm'}
                                </Button>
                            )}

                            {messages &&
                                pinnedMessages
                                    .slice(
                                        0,
                                        isShowAllPinMessages ? undefined : 1
                                    )
                                    .map((message) => (
                                        <Message
                                            key={message._id}
                                            messages={messages}
                                            data={message}
                                            searchMessage={findMessage}
                                            isLastMessage={
                                                lastMessage?._id === message._id
                                            }
                                            isSearchMessage={
                                                findMessage === message._id
                                            }
                                            handleClick={() => {
                                                // scroll to this message
                                                router.push(
                                                    `/messages/${conversation._id}?findMessage=${message._id}`
                                                );
                                            }}
                                            isPin={true}
                                        />
                                    ))}
                        </div>
                    </div>
                )}
            </>
        );
    };

    // Xử lý render tin nhắn
    const renderMessages = () => {
        return (
            <>
                {groupedMessages &&
                    messages &&
                    Object.keys(groupedMessages).map((date) => (
                        <div key={date} className="relative mb-2">
                            <div className="mt-2 pb-1 text-center text-xs text-secondary-1">
                                {date}
                            </div>
                            <div className={'flex flex-col-reverse'}>
                                {groupedMessages[date].map((message) => (
                                    <Message
                                        key={message._id}
                                        messages={messages}
                                        data={message}
                                        searchMessage={findMessage}
                                        isLastMessage={
                                            lastMessage?._id === message._id
                                        }
                                        isSearchMessage={
                                            findMessage === message._id
                                        }
                                        handleClick={
                                            findMessage
                                                ? handleOpenSearch
                                                : undefined
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                <div ref={topRef} className={'p-2'} />
            </>
        );
    };

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView]);

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
    }, [lastMessage, session?.user?.id, socketEmitor, conversation._id]);

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
    }, [showScrollDown]);

    // Xử lý tìm kiếm tin nhắn
    useEffect(() => {
        setIsFind(false);
    }, [findMessage]);

    // Nếu màn hình lớn thì đóng cả 2 khung tìm kiếm và thông tin
    useEffect(() => {
        if (breakpoint == 'lg') {
            setOpenInfo(false);
            setOpenSearch(false);
        }
    }, [breakpoint]);

    // Xử lý tìm kiếm tin nhắn
    useEffect(() => {
        if (findMessage && !isFind && messages && !isFetchingNextPage) {
            (async () => {
                try {
                    await handleFindMessage(findMessage);
                } catch (error: any) {
                    toast.error('Không tìm thấy tin nhắn');
                }
            })();
        }
    }, [
        findMessage,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFind,
        messages,
        handleFindMessage,
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
                className={cn('relative flex w-full', className)}
                onKeyDown={handleKeyDownEsc}
            >
                <FileUploaderWrapper
                    className={cn(
                        'flex h-full w-full flex-col rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none',
                        className,
                        openInfo && 'md:hidden',
                        openSearch && 'md:hidden'
                    )}
                    handleChange={handleChangeUploadFile}
                >
                    <ChatHeader
                        currentRoom={conversation}
                        handleOpenInfo={handleOpenInfo}
                        handleOpenSearch={handleOpenSearch}
                    />

                    <div className="relative h-[calc(100vh-112px)] w-full overflow-y-auto overflow-x-hidden p-2">
                        {renderPinnedMessasges()}

                        {isFetchingNextPage && (
                            <div className="absolute left-1/2 top-4 -translate-x-1/2 text-3xl">
                                <Icons.Loading />
                            </div>
                        )}

                        {isLoading && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl">
                                <Icons.Loading />
                            </div>
                        )}

                        <div className="relative flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden border-b px-1 pb-2 md:max-h-[calc(100%-58px)]">
                            <div ref={bottomRef} />

                            {renderMessages()}
                        </div>

                        {findMessage && (
                            <Button
                                className={cn(
                                    'absolute left-1/2 top-4 -translate-x-1/2'
                                )}
                                variant={'secondary'}
                                onClick={() => {
                                    router.push(
                                        `/messages/${conversation._id}`
                                    );
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
                </FileUploaderWrapper>

                <div
                    className={cn('w-[400px] lg:hidden lg:w-full', {
                        'lg:block': openInfo || openSearch,
                    })}
                >
                    {openSearch && (
                        <SearchMessage
                            openSearch={openSearch}
                            conversationId={conversation._id}
                            setOpenSearch={setOpenSearch}
                        />
                    )}

                    {!openSearch && (
                        <InfomationConversation
                            messages={messages || []}
                            conversation={conversation}
                            setOpenInfo={setOpenInfo}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatBox;
