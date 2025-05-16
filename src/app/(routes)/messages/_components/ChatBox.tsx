'use client';
import SearchMessage from '@/app/(routes)/messages/_components/SearchMessage';
import { FileUploaderWrapper } from '@/components/shared/FileUploader';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import { useLastMessage } from '@/context/SocialContext';
import useBreakpoint from '@/hooks/useBreakpoint';
import { useMessageHandling } from '@/hooks/useMessageHandling';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { sendMessage } from '@/lib/actions/message.action';
import axiosInstance from '@/lib/axios';
import { getMessagesKey } from '@/lib/queryKey';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, {
    KeyboardEventHandler,
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
    const { invalidateMessages } = useQueryInvalidation();
    const router = useRouter();
    const { breakpoint } = useBreakpoint();

    const {
        messages,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        handleFindMessage,
        isFind,
        setIsFind,
        fetchNextPage,
    } = useMessageHandling(conversation._id);

    const { data: lastMessage } = useLastMessage(conversation._id);

    // Memoize grouped messages with date formatting
    const groupedMessages = useMemo(() => {
        if (!messages?.length) return {};

        const formatter = new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        return messages.reduce(
            (acc, message) => {
                const date = formatter.format(new Date(message.createdAt));
                (acc[date] = acc[date] || []).push(message);
                return acc;
            },
            {} as Record<string, IMessage[]>
        );
    }, [messages]);

    // State UI
    const { ref: topRef, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openInfo, setOpenInfo] = useState<boolean>(true);
    const [showScrollDown, setShowScrollDown] = useState<boolean>(false);

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

            await invalidateMessages(conversation._id);
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

    // Render tin nhắn ghim
    // const renderPinnedMessasges = () => {
    //     return (
    //         <>
    //             {pinnedMessages.length > 0 && (
    //                 <TooltipProvider>
    //                     <Tooltip>
    //                         <TooltipTrigger asChild>
    //                             <Button
    //                                 className={
    //                                     'absolute right-0 top-0 z-20 h-8 px-2'
    //                                 }
    //                                 variant={'secondary'}
    //                                 onClick={() => {
    //                                     setShowPinMessages((prev) => !prev);
    //                                 }}
    //                             >
    //                                 {showPinMessages ? (
    //                                     <Icons.ArrowUp />
    //                                 ) : (
    //                                     <Icons.ArrowDown />
    //                                 )}
    //                             </Button>
    //                         </TooltipTrigger>

    //                         <TooltipContent>
    //                             Hiển thị tin nhắn ghim
    //                         </TooltipContent>
    //                     </Tooltip>
    //                 </TooltipProvider>
    //             )}

    //             {showPinMessages && (
    //                 <div
    //                     className={
    //                         'absolute top-2 z-10 w-[90%] rounded-xl bg-primary-1 p-2 shadow-xl dark:bg-dark-secondary-1 dark:shadow-none'
    //                     }
    //                 >
    //                     <span className={'flex items-center text-sm'}>
    //                         <Icons.Pin className={'mr-2'} /> Tin nhắn ghim
    //                     </span>

    //                     <div className="mt-2 flex flex-col-reverse">
    //                         {pinnedMessages.length > 1 && (
    //                             <Button
    //                                 size={'xs'}
    //                                 variant={'text'}
    //                                 onClick={() =>
    //                                     setIsShowAllPinMessages((prev) => !prev)
    //                                 }
    //                             >
    //                                 {isShowAllPinMessages
    //                                     ? 'Thu gọn'
    //                                     : 'Xem thêm'}
    //                             </Button>
    //                         )}

    //                         {messages &&
    //                             pinnedMessages
    //                                 .slice(
    //                                     0,
    //                                     isShowAllPinMessages ? undefined : 1
    //                                 )
    //                                 .map((message) => (
    //                                     <Message
    //                                         key={message._id}
    //                                         messages={messages}
    //                                         data={message}
    //                                         searchMessage={findMessage}
    //                                         isLastMessage={
    //                                             lastMessage?._id === message._id
    //                                         }
    //                                         isSearchMessage={
    //                                             findMessage === message._id
    //                                         }
    //                                         handleClick={() => {
    //                                             // scroll to this message
    //                                             router.push(
    //                                                 `/messages/${conversation._id}?findMessage=${message._id}`
    //                                             );
    //                                         }}
    //                                         isPin={true}
    //                                     />
    //                                 ))}
    //                     </div>
    //                 </div>
    //             )}
    //         </>
    //     );
    // };

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

    useEffect(() => {
        if (!session?.user?.id) return;

        socketEmitor.joinRoom({
            roomId: conversation._id,
            userId: session?.user.id,
        });
    }, [conversation._id, session?.user.id, socketEmitor]);

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
    // Optimize scroll observer
    useEffect(() => {
        if (!bottomRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => setShowScrollDown(!entry.isIntersecting),
            { threshold: 1 }
        );

        observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, []); // Remove showScrollDown dependency

    // Xử lý tìm kiếm tin nhắn
    useEffect(() => {
        setIsFind(false);
    }, [findMessage, setIsFind]);

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
                        'flex h-full w-full flex-1 flex-col rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none',
                        className,
                        openInfo && 'md:hidden',
                        openSearch && 'md:hidden'
                    )}
                    handleChange={handleChangeUploadFile}
                >
                    <ChatHeader
                        openInfo={openInfo}
                        openSearch={openSearch}
                        currentRoom={conversation}
                        handleOpenInfo={handleOpenInfo}
                        handleOpenSearch={handleOpenSearch}
                    />

                    <div className="relative h-[calc(100vh-112px)] w-full overflow-y-auto overflow-x-hidden p-2">
                        {/* {renderPinnedMessasges()} */}

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
                    className={cn(
                        'transition-all duration-300 lg:hidden lg:transition-none',
                        {
                            'w-[300px] lg:block lg:w-full':
                                openInfo || openSearch,
                            'w-0 lg:block': !openInfo && !openSearch,
                        }
                    )}
                >
                    {openSearch && (
                        <SearchMessage
                            openSearch={openSearch}
                            conversationId={conversation._id}
                            setOpenSearch={setOpenSearch}
                        />
                    )}

                    {openInfo && (
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
