'use client';
import { Avatar, ConfirmModal, Icons, SlideShow } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import { useSocket } from '@/context';
import {
    addPinMessage,
    removePinMessage,
} from '@/lib/actions/conversation.action';
import { DOMPurify } from 'dompurify';
import { deleteMessage } from '@/lib/actions/message.action';
import { invalidateMessages } from '@/lib/query';
import { cn } from '@/lib/utils';
import { urlRegex } from '@/utils/regex';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
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
    searchMessage?: IMessage;
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
        const queryClient = useQueryClient();

        // State
        const [showSlideShow, setShowSlideShow] = useState<boolean>(false);
        const [startIndex, setStartIndex] = useState<number>(0);
        const [openModalCofirm, setOpenModalConfirm] = useState<boolean>(false);
        const [openPopover, setOpenPopover] = useState(false);

        // Variables
        const isFindMessage = searchMessage && searchMessage._id === msg._id;
        const index = messages.findIndex((m) => m._id === msg._id);
        const isOwnMsg = msg.sender._id === session?.user.id;
        const messageRef = useRef<HTMLDivElement>(null);
        const isGroupMsg = msg.conversation.group;
        const memoizedImages = useMemo(
            () =>
                messages
                    .filter((msg) => msg.images.length > 0)
                    .map((msg) => msg.images)
                    .flatMap((img) => img),
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

                invalidateMessages(queryClient, msg.conversation._id);

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

                invalidateMessages(queryClient, msg.conversation._id);
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
                                'w-full max-w-full rounded-md bg-secondary-1 text-secondary-1 dark:bg-dark-primary-1 dark:text-dark-primary-1':
                                    isPin,
                            }
                        )}
                    >
                        <div onClick={handleClick}>
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
                                    className={cn(
                                        'max-w-[30vw] cursor-pointer',
                                        {
                                            'rounded-xl rounded-l-md': isOwnMsg,
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
                <Popover open={openPopover} onOpenChange={setOpenPopover}>
                    <div
                        className={cn('relative flex w-full', {
                            'flex-row-reverse': isOwnMsg,
                            'w-full items-center': isGroupMsg,
                        })}
                    >
                        {msg.isPin && !isPin && (
                            <div className={'absolute -right-1 top-0 z-10'}>
                                <Icons.Pin />
                            </div>
                        )}

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
                                    onClick={() => setOpenModalConfirm(true)}
                                    size={'xs'}
                                >
                                    <Icons.Delete className={'h-4 w-4'} /> Xóa
                                    tin nhắn
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
                                    <Icons.Pin className={'h-4 w-4'} />{' '}
                                    {msg.isPin ? 'Hủy ghim' : 'Ghim tin nhắn'}
                                </Button>
                            </div>
                        </PopoverContent>
                    )}
                </Popover>

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
