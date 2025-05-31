'use client';
import { Avatar, ConfirmModal, Icons, SlideShow } from '@/components/ui';
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
} from '@/components/ui/tooltip';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { useSocket } from '@/context';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import {
    addPinMessage,
    removePinMessage,
} from '@/lib/actions/conversation.action';
import { deleteMessage } from '@/lib/actions/message.action';
import { cn } from '@/lib/utils';
import { FormatDate } from '@/utils/formatDate';
import { urlRegex } from '@/utils/regex';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, {
    FormEventHandler,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import toast from 'react-hot-toast';

interface Props {
    data: IMessage;
    messages: IMessage[];
    handleClick?: () => void;
    searchMessage?: string;
    isSearchMessage?: boolean;
    ref?: React.RefObject<HTMLDivElement>;
    isLastMessage?: boolean;
    isPin?: boolean;
}

const Message: React.FC<Props> = React.memo<Props>(
    ({
        data: msg,
        messages,
        handleClick = () => {},
        searchMessage,
        isSearchMessage = false,
        isLastMessage,
        isPin = false,
    }) => {
        const { data: session } = useSession();
        const { socket, socketEmitor } = useSocket();
        const { invalidateMessages } = useQueryInvalidation();

        // State
        const [showSlideShow, setShowSlideShow] = useState<boolean>(false);
        const [startIndex, setStartIndex] = useState<number>(0);
        const [openModalCofirm, setOpenModalConfirm] = useState<boolean>(false);
        const [openPopover, setOpenPopover] = useState(false);

        const images = msg.media.filter(
            (media) => media.resourceType === 'image'
        );
        const videos = msg.media.filter(
            (media) => media.resourceType === 'video'
        );

        // Variables
        const isFindMessage = searchMessage && searchMessage === msg._id;
        const index = messages.findIndex((m) => m._id === msg._id);
        const isOwnMsg = msg.sender._id === session?.user.id;
        const messageRef = useRef<HTMLDivElement>(null);
        const isGroupMsg = msg.conversation.group;
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

                await addPinMessage({
                    messageId: msg._id,
                    conversationId: msg.conversation._id,
                });

                toast.success('Đã ghim tin nhắn!', { id: 'pin-message' });

                await invalidateMessages(msg.conversation._id);

                socketEmitor.pinMessage({
                    message: msg,
                });
            } catch (error) {
                toast.error('Đã có lỗi xảy ra!', { id: 'pin-message' });
            }
        };

        // Xử lý hủy ghim tin nhắn
        const handleUnPinMessage = async () => {
            try {
                if (!socket || !msg.isPin) return;

                await removePinMessage({
                    messageId: msg._id,
                    conversationId: msg.conversation._id,
                });

                toast.success('Đã hủy ghim tin nhắn!', { id: 'unpin-message' });

                await invalidateMessages(msg.conversation._id);
            } catch (error) {
                toast.error('Đã có lỗi xảy ra!', { id: 'unpin-message' });
            }
        };

        // Xử lý xóa tin nhắn
        const handleDeleteMsg: FormEventHandler = async (e) => {
            e.preventDefault();

            try {
                if (!socket) return;

                await deleteMessage({ messageId: msg._id });

                if (msg.isPin) {
                    await removePinMessage({
                        messageId: msg._id,
                        conversationId: msg.conversation._id,
                    });
                }

                toast.success('Đã xóa tin nhắn!', { id: 'delete-message' });

                await invalidateMessages(msg.conversation._id);

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
                                    {msg.text.split(' ').map((text, index) => {
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
                                                <span key={msg._id + index}>
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
                                                    'max-w-[30vw] cursor-pointer md:max-w-[60vw]',
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

                                        {isOwnMsg &&
                                            !isPin &&
                                            !isSearchMessage && (
                                                <TooltipContent
                                                    className={'p-1'}
                                                    side={
                                                        isOwnMsg
                                                            ? 'left'
                                                            : 'right'
                                                    }
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
                                                                setOpenModalConfirm(
                                                                    true
                                                                )
                                                            }
                                                            size={'xs'}
                                                        >
                                                            <Icons.Delete
                                                                className={
                                                                    'h-4 w-4'
                                                                }
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
                                                                className={
                                                                    'h-4 w-4'
                                                                }
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
                id={msg._id + (isPin ? 'pinned' : '')}
                key={msg._id}
                className={cn('relative flex w-full', {
                    'justify-end': isOwnMsg,
                    'justify-start': !isOwnMsg,
                })}
                ref={messageRef}
            >
                <div
                    className={cn('relative flex w-full', {
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
                                'border-2 border-yellow-300': isFindMessage,
                                'cursor-pointer': isSearchMessage,
                                'bg-transparent': msg.text.length === 0,
                                'px-2': isGroupMsg,
                                'mx-2 border-none': isPin,
                            }
                        )}
                    >
                        {msg.conversation.group && !isOwnMsg && (
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
                            {!isPin && msg.conversation.group && !isOwnMsg && (
                                <div
                                    className={cn(
                                        'text-xs text-primary-1 dark:text-dark-primary-1',
                                        {
                                            'ml-1': !isOwnMsg,
                                            'mr-1': isOwnMsg,
                                        }
                                    )}
                                >
                                    {msg.sender.name}
                                </div>
                            )}

                            {isPin && (
                                <div
                                    className={cn(
                                        'text-xs text-primary-1 dark:text-dark-primary-1',
                                        {
                                            'ml-1': !isOwnMsg,
                                            'mr-1': isOwnMsg,
                                        }
                                    )}
                                >
                                    {msg.sender.name}
                                </div>
                            )}

                            {renderContentImages()}

                            <Popover
                                open={openPopover}
                                onOpenChange={setOpenPopover}
                            >
                                <PopoverTrigger
                                    asChild
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {renderMessageText()}
                                </PopoverTrigger>

                                {isOwnMsg && !isPin && !isSearchMessage && (
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
                                                />{' '}
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
                                    </PopoverContent>
                                )}
                            </Popover>

                            {/* {isPin && ( */}
                            {/* <div
                                className={
                                    'p-1 text-xs text-primary-1 dark:text-dark-primary-1'
                                }
                            >
                                {FormatDate.formatISODateToHHMM(msg.createdAt)}
                            </div> */}
                            {/* )} */}

                            {renderReadMessage()}
                        </div>
                    </div>
                </div>

                <SlideShow
                    show={showSlideShow}
                    setShow={setShowSlideShow}
                    images={memoizedImages.reverse()}
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
    }
);

Message.displayName = 'Message';

export default Message;
