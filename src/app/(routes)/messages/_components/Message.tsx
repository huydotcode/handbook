'use client';
import { Avatar, Icons, SlideShow } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import { deleteMessage } from '@/lib/actions/message.action';
import { invalidateMessages } from '@/lib/query';
import { cn } from '@/lib/utils';
import { urlRegex } from '@/utils/regex';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { FormEventHandler, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { timeConvert } from '@/utils/timeConvert';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { TooltipArrow } from '@radix-ui/react-tooltip';

interface Props {
    data: IMessage;
    messages: IMessage[];
    handleClick?: () => void;
    searchMessage?: IMessage;
    isSearchMessage?: boolean;
    ref?: React.RefObject<HTMLDivElement>;
    isLastMessage?: boolean;
}

const Message: React.FC<Props> = ({
    data: msg,
    messages,
    handleClick,
    searchMessage,
    isSearchMessage = false,
    isLastMessage,
}) => {
    const { data: session } = useSession();
    const isFindMessage = searchMessage && searchMessage._id === msg._id;

    const { socket, socketEmitor } = useSocket();
    const queryClient = useQueryClient();

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [showSlideShow, setShowSlideShow] = useState<boolean>(false);
    const [startIndex, setStartIndex] = useState<number>(0);
    const menuRef = useRef<HTMLDivElement>(null);

    const index = messages.findIndex((m) => m._id === msg._id);
    const isOwnMsg = msg.sender._id === session?.user.id;
    const messageRef = useRef<HTMLDivElement>(null);

    const images = messages
        ? messages
              .filter((msg) => msg.images.length > 0)
              .map((msg) => msg.images)
              .flatMap((img) => img)
        : [];

    const handleShowMenu = () => setShowMenu(true);
    const handleHideMenu = () => setShowMenu(false);
    const handleClickContent = () => {
        handleShowMenu();
    };

    // Xử lý click vào ảnh
    const handleClickImage = (url: string) => {
        const index = images.findIndex((img) => img.url === url);

        setStartIndex(() => {
            return index;
        });
        setShowSlideShow(true);
    };

    // Xử lý xóa tin nhắn
    const handleDeleteMsg: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            if (!socket) return;

            await deleteMessage({ messageId: msg._id });

            invalidateMessages(queryClient, msg.conversation._id);

            socketEmitor.deleteMessage({
                message: msg,
            });
        } catch (error) {
            toast.error('Đã có lỗi xảy ra!', { id: 'delete-message' });
        }
    };

    const msgTextContent = () => {
        return (
            <>
                {msg.text.split(' ').map((text, index) => {
                    // Kểm tra url
                    if (text.match(urlRegex)) {
                        return (
                            <a
                                key={index}
                                href={text}
                                target="_blank"
                                rel="noreferrer"
                                className={cn('underline', {
                                    'text-primary-1': isOwnMsg,
                                    'text-primary-2 dark:text-dark-primary-1':
                                        !isOwnMsg,
                                    'text-yellow-300': isFindMessage,
                                })}
                            >
                                {text + ' '}
                            </a>
                        );
                    } else {
                        return (
                            <span
                                className={cn({
                                    'font-bold text-yellow-400': isFindMessage,
                                })}
                                key={index}
                            >
                                {text + ' '}
                            </span>
                        );
                    }
                })}
            </>
        );
    };

    const createMenuMessages = () => {
        return (
            <div
                ref={menuRef}
                className="absolute right-[120%] top-0 flex items-center rounded-xl"
            >
                <Button
                    variant="text"
                    size="sm"
                    type="submit"
                    onClick={handleDeleteMsg}
                >
                    <Icons.Delete />
                </Button>
            </div>
        );
    };

    // Xử lý click ngoài menu
    useEffect(() => {
        if (menuRef.current) {
            const handleClickOutside = (e: MouseEvent) => {
                if (!menuRef.current?.contains(e.target as Node)) {
                    setShowMenu(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () =>
                document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    // Xử lý ẩn menu
    useEffect(() => {
        if (showMenu || !isSearchMessage) {
            const timer = setTimeout(() => handleHideMenu(), 2000);
            return () => clearTimeout(timer);
        }
    }, [isSearchMessage, showMenu]);

    useEffect(() => {
        if (isLastMessage) {
            messageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isLastMessage]);

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    return (
        <div
            id={msg._id}
            key={msg._id}
            className={cn('relative mb-[2px] flex w-full ', {
                'justify-end': isOwnMsg,
                'justify-start': !isOwnMsg,
            })}
            ref={messageRef}
        >
            <div
                className={cn('flex', {
                    'flex-row-reverse': isOwnMsg,
                    'w-full items-center': !msg.conversation.group,
                })}
            >
                {isSearchMessage && (
                    <div
                        className={cn('absolute text-xs text-secondary-1', {
                            'left-0': isOwnMsg,
                            'right-0': !isOwnMsg,
                        })}
                    >
                        {timeConvert(msg.createdAt.toString())}
                    </div>
                )}

                {msg.conversation.group && (
                    <div
                        className={cn(
                            'relative flex h-8 w-8 items-center p-2',
                            {
                                'mr-2 pr-4': !isOwnMsg,
                                'ml-2 pl-4': isOwnMsg,
                            }
                        )}
                    >
                        <Avatar imgSrc={msg.sender.avatar} fill />
                    </div>
                )}

                <div
                    className={cn('flex w-full flex-1 flex-col', {
                        'items-end': isOwnMsg,
                        'items-start': !isOwnMsg,
                    })}
                >
                    {msg.conversation.group && (
                        <div
                            className={cn('text-xs', {
                                'ml-1': !isOwnMsg,
                                'mr-1': isOwnMsg,
                            })}
                        >
                            {msg.sender.name}
                        </div>
                    )}

                    {msg.images.length > 0 && (
                        <div
                            className={cn('flex flex-col flex-wrap', {
                                'items-end': isOwnMsg,
                                'items-start': !isOwnMsg,
                            })}
                        >
                            {msg.images.map((img, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        `relative my-1 h-[${img.height}px] w-[${img.width}px] aspect-auto cursor-pointer shadow-md`,
                                        {
                                            'rounded-xl rounded-l-md': isOwnMsg,
                                            'rounded-xl rounded-r-md':
                                                !isOwnMsg,
                                        }
                                    )}
                                >
                                    <Image
                                        onClick={() => {
                                            handleClickImage(img.url);
                                        }}
                                        src={img.url}
                                        alt="image"
                                        fill
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        'relative flex max-w-[70%] items-center px-4 py-2 text-xs',
                                        {
                                            'items-end rounded-xl rounded-r-md bg-primary-2 text-white':
                                                isOwnMsg,
                                            'rounded-xl rounded-l-md bg-primary-1 dark:bg-dark-secondary-2':
                                                !isOwnMsg,
                                            'border-4 border-yellow-300':
                                                isFindMessage,
                                            'cursor-pointer': isSearchMessage,
                                            'bg-transparent':
                                                msg.text.length === 0,
                                        }
                                    )}
                                >
                                    {msg.text.trim().length > 0 && (
                                        <div
                                            onClick={() => {
                                                handleClickContent();
                                                if (handleClick) {
                                                    handleClick();
                                                }
                                            }}
                                        >
                                            {showMenu &&
                                                isOwnMsg &&
                                                !isSearchMessage &&
                                                createMenuMessages()}

                                            <div className="flex flex-col">
                                                <p>{msgTextContent()}</p>
                                            </div>

                                            {index == 0 &&
                                                !isSearchMessage &&
                                                msg.sender._id ===
                                                    session?.user.id && (
                                                    <span className="text-xs text-secondary-1">
                                                        {msg.isRead && 'Đã xem'}
                                                    </span>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <TooltipArrow className={'fill-white'} />
                                <div className="flex items-center justify-center">
                                    Đã gửi{' '}
                                    {timeConvert(msg.createdAt.toString())}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <SlideShow
                show={showSlideShow}
                setShow={setShowSlideShow}
                images={images.reverse()}
                startIndex={startIndex}
            />
        </div>
    );
};
export default Message;
