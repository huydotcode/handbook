'use client';
import { Avatar, ConfirmModal, Icons, SlideShow } from '@/components/ui';
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
import Link from 'next/link';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';

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

    const [showSlideShow, setShowSlideShow] = useState<boolean>(false);
    const [startIndex, setStartIndex] = useState<number>(0);
    const [openModalCofirm, setOpenModalConfirm] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [openPopover, setOpenPopover] = useState(false);

    const handleMouseEnter = () => {
        setOpenPopover(true);
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
            setOpenPopover(false);
        }, 3000);
    };

    const index = messages.findIndex((m) => m._id === msg._id);
    const isOwnMsg = msg.sender._id === session?.user.id;
    const messageRef = useRef<HTMLDivElement>(null);
    const isGroupMsg = msg.conversation.group;

    const images = messages
        ? messages
              .filter((msg) => msg.images.length > 0)
              .map((msg) => msg.images)
              .flatMap((img) => img)
        : [];

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

    const renderMessageText = () => {
        return (
            msg.text.trim().length > 0 && (
                <div
                    className={cn(
                        'max-w-[70%] break-words rounded-xl px-4 py-2',
                        {
                            'bg-primary-2 text-white': isOwnMsg,
                            'bg-primary-1 pl-4 dark:bg-dark-secondary-2':
                                !isOwnMsg,
                            'mt-1': isGroupMsg,
                            'pl-4': isGroupMsg && isOwnMsg,
                            'pr-4': isGroupMsg && !isOwnMsg,
                        }
                    )}
                >
                    <div
                        onClick={() => {
                            if (handleClick) {
                                handleClick();
                            }
                        }}
                    >
                        <div className="flex max-w-full flex-col flex-wrap">
                            <p
                                className={'max-w-full break-words'}
                                key={msg._id + index}
                            >
                                {msg.text.split(' ').map((text, index) => {
                                    // Kểm tra url ( hoặc dạng /posts/postId)
                                    if (
                                        text.match(urlRegex) ||
                                        text.match(/\/posts\/\w+/)
                                    ) {
                                        return (
                                            <Link
                                                key={msg._id + index}
                                                href={text}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={cn(
                                                    'max-w-full break-words underline',
                                                    {
                                                        'text-white': isOwnMsg,
                                                        'text-primary-1 dark:text-dark-primary-1':
                                                            !isOwnMsg,
                                                        'text-yellow-300':
                                                            isFindMessage,
                                                    }
                                                )}
                                            >
                                                {text + ' '}
                                            </Link>
                                        );
                                    } else {
                                        return (
                                            <span key={msg._id + index}>
                                                {text + ' '}
                                            </span>
                                        );
                                    }
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )
        );
    };

    const renderReadMessage = () => {
        return (
            <>
                {index == 0 &&
                    !isGroupMsg &&
                    !isSearchMessage &&
                    msg.sender._id === session?.user.id && (
                        <span className="text-xs text-secondary-1">
                            {msg.isRead && 'Đã xem'}
                        </span>
                    )}
            </>
        );
    };

    const renderContentImages = () => {
        return (
            <>
                {msg.images.length > 0 && (
                    <div
                        className={cn('flex flex-col flex-wrap', {
                            'items-end': isOwnMsg,
                            'items-start': !isOwnMsg,
                        })}
                    >
                        {msg.images.map((img) => (
                            <Image
                                key={img._id}
                                className={cn('max-w-[30vw] cursor-pointer', {
                                    'rounded-xl rounded-l-md': isOwnMsg,
                                    'rounded-xl rounded-r-md': !isOwnMsg,
                                })}
                                onClick={() => {
                                    handleClickImage(img.url);
                                }}
                                src={img.url}
                                alt="image"
                                width={img.width}
                                height={img.height}
                            />
                        ))}
                    </div>
                )}
            </>
        );
    };

    useEffect(() => {
        if (isLastMessage) {
            messageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isLastMessage]);

    return (
        <div
            id={msg._id}
            key={msg._id}
            className={cn('relative flex w-full', {
                'justify-end': isOwnMsg,
                'justify-start': !isOwnMsg,
            })}
            ref={messageRef}
        >
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <div
                    className={cn('flex w-full', {
                        'flex-row-reverse': isOwnMsg,
                        'w-full items-center': isGroupMsg,
                    })}
                >
                    <div
                        className={cn(
                            'relative mb-1 flex w-full items-center text-xs',
                            {
                                'flex-row-reverse items-end rounded-xl rounded-r-md text-white':
                                    isOwnMsg,
                                'rounded-xl rounded-l-md': !isOwnMsg,
                                'border-4 border-yellow-300': isFindMessage,
                                'cursor-pointer': isSearchMessage,
                                'bg-transparent': msg.text.length === 0,
                                'px-2': isGroupMsg,
                            }
                        )}
                    >
                        {isSearchMessage && (
                            <div
                                className={cn(
                                    'absolute text-xs text-secondary-1',
                                    {
                                        'left-0': isOwnMsg,
                                        'right-0': !isOwnMsg,
                                    }
                                )}
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
                            {renderContentImages()}
                            <PopoverTrigger
                                asChild
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {renderMessageText()}
                            </PopoverTrigger>

                            {renderReadMessage()}
                        </div>
                    </div>
                </div>

                {isOwnMsg && (
                    <PopoverContent
                        className={'p-1'}
                        side={isOwnMsg ? 'left' : 'right'}
                        asChild
                    >
                        <div
                            className={
                                'flex max-w-[150px] flex-col items-center'
                            }
                        >
                            <Button
                                className={'w-full justify-start rounded-none'}
                                variant={'ghost'}
                                onClick={() => setOpenModalConfirm(true)}
                                size={'xs'}
                            >
                                <Icons.Delete className={'h-4 w-4'} /> Xóa tin
                                nhắn
                            </Button>

                            <Button
                                className={'w-full justify-start rounded-none'}
                                variant={'ghost'}
                                onClick={() => setOpenModalConfirm(true)}
                                size={'xs'}
                            >
                                <Icons.Pin className={'h-4 w-4'} /> Ghim tin
                                nhắn
                            </Button>
                        </div>
                    </PopoverContent>
                )}
            </Popover>

            <SlideShow
                show={showSlideShow}
                setShow={setShowSlideShow}
                images={images.reverse()}
                startIndex={startIndex}
            />

            <ConfirmModal
                open={openModalCofirm}
                setShow={setOpenModalConfirm}
                onClose={() => setOpenModalConfirm(false)}
                onConfirm={handleDeleteMsg}
                title="Xóa tin nhắn"
                message="Bạn có chắc chắn muốn xóa tin nhắn này không?"
                confirmText="Xóa"
                cancelText="Hủy"
            />
        </div>
    );
};

export default Message;
