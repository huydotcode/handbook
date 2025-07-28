'use client';
import { ConfirmModal, Icons, SlideShow } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import Image from '@/components/ui/image';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { useSocket } from '@/context';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import ConversationService from '@/lib/services/conversation.service';
import MessageService from '@/lib/services/message.service';
import { cn } from '@/lib/utils';
import { FormatDate } from '@/utils/formatDate';
import { urlRegex } from '@/utils/regex';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FormEventHandler, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import MessageAction from './MessageAction';

interface MessageContentProps {
    msg: IMessage;
    messages: IMessage[];

    searchMessage?: string;
    isSearchMessage?: boolean;
    isLastMessage?: boolean;
    isPin: boolean;

    handleClick: () => void;
}

const MessageContent = ({
    msg,
    messages,
    searchMessage,
    isSearchMessage = false,
    isPin = false,
    handleClick,
}: MessageContentProps) => {
    const { data: session } = useSession();
    const { socket, socketEmitor } = useSocket();
    const {
        queryClientAddPinnedMessage,
        queryClientDeleteMessage,
        queryClientRemovePinnedMessage,
    } = useQueryInvalidation();

    // State
    const [showSlideShow, setShowSlideShow] = useState<boolean>(false);
    const [startIndex, setStartIndex] = useState<number>(0);
    const [openModalCofirm, setOpenModalConfirm] = useState<boolean>(false);
    const [openPopover, setOpenPopover] = useState(false);

    const images = msg.media.filter((media) => media.resourceType === 'image');
    const videos = msg.media.filter((media) => media.resourceType === 'video');

    // Variables
    const isFindMessage =
        searchMessage && searchMessage === msg._id && isSearchMessage
            ? true
            : false;
    const index = messages.findIndex((m) => m._id === msg._id);
    const isOwnMsg = msg.sender._id === session?.user.id;

    const isGroupMsg = msg.conversation.group ? true : false;
    const memoizedImages = useMemo(
        () =>
            messages
                .filter((msg) => msg.media && msg.media.length > 0)
                .flatMap((msg) => msg.media)
                .filter((media) => media.resourceType === 'image'),
        [messages]
    );

    // Function
    const handleMouseEnter = () => {
        setOpenPopover(true);
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
            setOpenPopover(false);
        }, 3000);
    };

    // Xử lý click vào ảnh
    const handleClickImage = (url: string) => {
        const index = memoizedImages.findIndex((img) => img.url === url);

        setStartIndex(() => {
            return index;
        });
        setShowSlideShow(true);
    };

    // Xử lý ghim tin nhắn
    const handlePinMessage = async () => {
        if (messages.filter((msg) => msg.isPin).length >= 5) {
            toast.error('Không thể ghim quá 5 tin nhắn!', {
                id: 'pin-message',
            });
            return;
        }

        try {
            if (!socket || msg.isPin) return;

            await ConversationService.addPinMessage({
                messageId: msg._id,
                conversationId: msg.conversation._id,
            });

            toast.success('Đã ghim tin nhắn!', { id: 'pin-message' });

            queryClientAddPinnedMessage(msg);

            socketEmitor.pinMessage({
                message: msg,
            });
        } catch (error) {
            console.log(error);
            toast.error('Đã có lỗi xảy ra!', { id: 'pin-message' });
        }
    };

    // Xử lý hủy ghim tin nhắn
    const handleUnPinMessage = async () => {
        try {
            if (!socket || !msg.isPin) return;

            await ConversationService.removePinMessage({
                messageId: msg._id,
                conversationId: msg.conversation._id,
            });

            toast.success('Đã hủy ghim tin nhắn!', { id: 'unpin-message' });

            queryClientRemovePinnedMessage(msg);

            socketEmitor.unpinMessage({
                message: msg,
            });
        } catch (error) {
            toast.error('Đã có lỗi xảy ra!', { id: 'unpin-message' });
        }
    };

    // Xử lý xóa tin nhắn
    const handleDeleteMsg: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            if (!socket) return;

            await MessageService.delete({
                messageId: msg._id,
                conversationId: msg.conversation._id,
                prevMessageId: messages[index - 1]
                    ? messages[index - 1]._id
                    : null,
            });

            if (msg.isPin) {
                await ConversationService.removePinMessage({
                    messageId: msg._id,
                    conversationId: msg.conversation._id,
                });
            }

            toast.success('Đã xóa tin nhắn!', { id: 'delete-message' });

            queryClientDeleteMessage(msg);

            socketEmitor.deleteMessage({
                message: msg,
            });
        } catch (error) {
            toast.error('Đã có lỗi xảy ra!', { id: 'delete-message' });
        }
    };

    return (
        <>
            {images.length > 0 && (
                <div
                    className={cn('flex flex-col flex-wrap', {
                        'items-end': isOwnMsg,
                        'items-start': !isOwnMsg,
                    })}
                >
                    {images.map((img) => (
                        <TooltipProvider key={img._id}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Image
                                        className={cn(
                                            'max-h-[60vh] max-w-[30vw] cursor-pointer object-cover md:max-w-[60vw]',
                                            {
                                                'rounded-xl rounded-l-md':
                                                    isOwnMsg,
                                                'rounded-xl rounded-r-md':
                                                    !isOwnMsg,
                                                'w-full': isPin,
                                            }
                                        )}
                                        onClick={() => {
                                            handleClickImage(img.url);
                                        }}
                                        src={img.url}
                                        alt="image"
                                        width={img.width}
                                        height={img.height}
                                    />
                                </TooltipTrigger>

                                {isOwnMsg && !isPin && !isSearchMessage && (
                                    <TooltipContent
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
                                                className={
                                                    'w-full justify-start rounded-none'
                                                }
                                                variant={'ghost'}
                                                onClick={() =>
                                                    setOpenModalConfirm(true)
                                                }
                                                size={'xs'}
                                            >
                                                <Icons.Delete
                                                    className={'h-4 w-4'}
                                                />
                                                Xóa tin nhắn
                                            </Button>

                                            <Button
                                                className={
                                                    'w-full justify-start rounded-none'
                                                }
                                                variant={'ghost'}
                                                onClick={() => {
                                                    if (msg.isPin) {
                                                        handleUnPinMessage();
                                                    } else {
                                                        handlePinMessage();
                                                    }
                                                }}
                                                size={'xs'}
                                            >
                                                <Icons.Pin
                                                    className={'h-4 w-4'}
                                                />{' '}
                                                {msg.isPin
                                                    ? 'Hủy ghim'
                                                    : 'Ghim tin nhắn'}
                                            </Button>
                                        </div>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            )}

            {videos.length > 0 && (
                <div className="mb-2 flex flex-col gap-2">
                    {videos.map((video) => (
                        <div
                            className="max-w-[30vw] md:max-w-[60vw]"
                            key={video._id}
                        >
                            <VideoPlayer src={video.url} />
                        </div>
                    ))}
                </div>
            )}

            <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger
                    asChild
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {msg.text.trim().length > 0 && (
                        <div
                            className={cn(
                                'relative max-w-[70%] break-words rounded-xl px-3 py-2',
                                {
                                    'bg-primary-2 text-white': isOwnMsg,
                                    'bg-primary-1 dark:bg-dark-secondary-2':
                                        !isOwnMsg,
                                    'mt-1': isGroupMsg || msg.media.length > 0,
                                    'min-w-[100px]': isGroupMsg,
                                    'w-full max-w-full rounded-md bg-primary-1 text-primary-1 dark:bg-dark-secondary-2 dark:text-dark-primary-1':
                                        isPin,
                                }
                            )}
                        >
                            <div onClick={handleClick}>
                                <div className="flex max-w-full flex-col flex-wrap">
                                    <p
                                        className="max-w-full break-words"
                                        key={msg._id + index}
                                    >
                                        {msg.text
                                            .split(' ')
                                            .map((text, index) => {
                                                if (
                                                    text.match(urlRegex) ||
                                                    text.match(/\/posts\/\w+/)
                                                ) {
                                                    return (
                                                        <Link
                                                            key={
                                                                msg._id + index
                                                            }
                                                            href={text}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className={cn(
                                                                'max-w-full break-words underline',
                                                                {
                                                                    'text-white':
                                                                        isOwnMsg,
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
                                                        <span
                                                            key={
                                                                msg._id + index
                                                            }
                                                        >
                                                            {text + ' '}
                                                        </span>
                                                    );
                                                }
                                            })}
                                    </p>
                                </div>
                            </div>

                            {msg.isPin && !isPin && (
                                <div
                                    className={cn('absolute top-0 z-10', {
                                        '-left-1': !isOwnMsg,
                                        '-right-1': isOwnMsg,
                                    })}
                                >
                                    <Icons.Pin className="h-4 w-4 text-dark-secondary-1 dark:text-secondary-1" />
                                </div>
                            )}

                            <div
                                className={cn('flex text-xs text-secondary-2', {
                                    'text-secondary-1': !isOwnMsg,
                                    'justify-end': isOwnMsg,
                                })}
                            >
                                {FormatDate.formatISODateToHHMM(msg.createdAt)}
                            </div>
                        </div>
                    )}
                </PopoverTrigger>

                {isOwnMsg && !isPin && !isSearchMessage && (
                    <MessageAction
                        msg={msg}
                        messages={messages}
                        index={index}
                    />
                )}
            </Popover>

            <SlideShow
                show={showSlideShow}
                setShow={setShowSlideShow}
                images={memoizedImages}
                startIndex={startIndex}
            />
        </>
    );
};

export default MessageContent;
