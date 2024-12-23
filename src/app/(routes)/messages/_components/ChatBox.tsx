'use client';
import { Button, Icons } from '@/components/ui';
import socketEvent from '@/constants/socketEvent.constant';
import { useChat, useSocket } from '@/context';
import { MessageService } from '@/lib/services';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React, {
    KeyboardEventHandler,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import ChatHeader from './ChatHeader';
import InputMessage from './InputMessage';
import Message from './Message';
import InfomationConversation from './InfomationConversation';
import { Input, InputRef } from 'antd';

interface Props {
    className?: string;
    initialMessages: IMessage[];
    conversation: IConversation;
}

const PAGE_SIZE = 20;

const ChatBox: React.FC<Props> = ({
    className,
    initialMessages,
    conversation,
}) => {
    const { socket } = useSocket();
    const { data: session } = useSession();
    const { setCurrentRoom, setLastMessages } = useChat();
    const { ref: topRef, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    const [messages, setMessages] = useState<IMessage[]>(initialMessages);
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);

    const searchMessages = useMemo(() => {
        return searchValue.trim().length > 0
            ? messages.filter((msg) => msg.text.includes(searchValue))
            : [];
    }, [messages, searchValue]);
    const messagesInRoom = useMemo(() => {
        return messages.filter(
            (msg) => msg.conversation._id === conversation._id
        );
    }, [messages, conversation._id]);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<InputRef>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Xử lý mở khung tìm kiếm
    const handleOpenSearch = () => {
        setOpenSearch(true);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Xử lý nhấn Esc để đóng khung tìm kiếm
    const handleKeyDownEsc: KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === 'Escape' && openSearch) {
            setOpenSearch(false);
            setSearchValue('');
        }
    };

    // Cuộn xuống dưới cùng
    const handleScrollDown = () => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    // Set current room
    useEffect(() => {
        setCurrentRoom(conversation._id);
    }, [conversation._id]);

    // Lấy tin nhắn
    useEffect(() => {
        (async () => {
            if (!conversation._id || isEnd) return;

            const messages = (await MessageService.getMessages({
                conversationId: conversation._id,
                page,
                pageSize: PAGE_SIZE,
            })) as IMessage[];

            if (messages.length === 0) {
                setIsEnd(true);
                return;
            }

            setMessages((prev) => [...prev, ...messages]);
        })();
    }, [conversation._id, page]);

    // Lắng nghe tin nhắn mới
    useEffect(() => {
        if (!socket || !conversation._id || !session?.user.id) return;

        socket.on(socketEvent.RECEIVE_MESSAGE, (message: IMessage) => {
            setLastMessages((prev) => ({
                ...prev,
                [message.conversation._id]: message,
            }));
            if (message.sender._id === session?.user?.id) return;
            setMessages((prev) => [message, ...prev]);
        });

        socket.on(
            socketEvent.DELETE_MESSAGE,
            ({ prevMsg, msg }: { prevMsg: IMessage; msg: IMessage }) => {
                setMessages((prev) =>
                    prev.filter((item) => item._id !== msg._id)
                );
            }
        );
    }, [socket, conversation._id, session?.user.id]);

    // Kiểm tra nếu đang ở bottomRef thì không hiển thị nút scroll down
    useEffect(() => {
        if (!bottomRef.current || messages.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            setShowScrollDown(!entries[0].isIntersecting);
        });
        observer.observe(bottomRef.current);

        return () => observer.disconnect();
    }, [bottomRef.current]);

    useEffect(() => {
        if (inView && !isEnd) {
            setPage((prev) => prev + 1);
        }
    }, [inView]);

    // Xử lý click ngoài khung tìm kiếm
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target as Node)
            ) {
                setOpenSearch(false);
                setSearchValue('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

                <div className="relative h-[calc(100%-112px)] w-full overflow-y-auto overflow-x-hidden p-2 ">
                    {openSearch && (
                        <div
                            className="absolute right-2 top-2 z-10 "
                            ref={searchRef}
                        >
                            <div
                                className={
                                    'flex items-center rounded-xl border bg-primary-1 px-2 dark:bg-dark-secondary-1'
                                }
                            >
                                <Icons.Search size={24} />
                                <Input
                                    className={
                                        'dark:text-dark-primary-1 dark:placeholder:text-secondary-2'
                                    }
                                    ref={inputRef}
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    placeholder="Tìm kiếm tin nhắn"
                                    bordered={false}
                                />
                                <Button
                                    onClick={() => {
                                        setOpenSearch(false);
                                        setSearchValue('');
                                    }}
                                    variant={'default'}
                                    border={false}
                                >
                                    <Icons.Close size={18} />
                                </Button>
                            </div>

                            <h5 className={'mt-2 text-xs text-secondary-1'}>
                                Kết quả: {searchMessages.length} tin nhắn
                            </h5>
                        </div>
                    )}

                    {session?.user && (
                        <div className="relative flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden border-b px-1 pb-2">
                            <div ref={bottomRef} />
                            {searchMessages.length > 0
                                ? searchMessages.map((msg) => (
                                      <Message
                                          key={msg._id}
                                          data={msg}
                                          messagesInRoom={messages}
                                      />
                                  ))
                                : messagesInRoom.map((msg) => (
                                      <Message
                                          key={msg._id}
                                          data={msg}
                                          messagesInRoom={messages}
                                      />
                                  ))}

                            {!isEnd && <div ref={topRef} />}
                        </div>
                    )}
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

                    <InputMessage
                        currentRoom={conversation}
                        setMessages={setMessages}
                    />
                </div>
            </div>

            {openInfo && (
                <InfomationConversation
                    conversation={conversation}
                    messagesInRoom={messagesInRoom}
                    openInfo={openInfo}
                    setOpenInfo={setOpenInfo}
                />
            )}
        </>
    );
};

export default ChatBox;
