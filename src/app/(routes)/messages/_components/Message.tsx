'use client';
import { Avatar, Button, Icons, SlideShow } from '@/components/ui';
import { useSocket } from '@/context';
import { useMessages } from '@/context/SocialContext';
import { deleteMessage } from '@/lib/actions/message.action';
import { invalidateMessages } from '@/lib/query';
import { cn } from '@/lib/utils';
import { FormatDate } from '@/utils/formatDate';
import { urlRegex } from '@/utils/regex';
import { Tooltip } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { FormEventHandler, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    data: IMessage;
    messages: IMessage[];
}

const Message: React.FC<Props> = ({ data: msg, messages }) => {
    const { data: session } = useSession();

    const { socket, socketEmitor } = useSocket();
    const queryClient = useQueryClient();

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [showSlideShow, setShowSlideShow] = useState<boolean>(false);
    const [startIndex, setStartIndex] = useState<number>(0);
    const menuRef = useRef<HTMLDivElement>(null);

    const index = messages.findIndex((m) => m._id === msg._id);
    const isOwnMsg = msg.sender._id === session?.user.id;

    const images = messages
        ? messages
              .filter((msg) => msg.images.length > 0)
              .map((msg) => msg.images)
              .map((img) => img.map((i) => i.url))
        : [];

    const handleShowMenu = () => setShowMenu(true);
    const handleHideMenu = () => setShowMenu(false);
    const handleClickContent = () => {
        handleShowMenu();
    };

    // Xử lý click vào ảnh
    const handleClickImage = (url: string, index: number) => {
        setStartIndex(() => {
            return images.flat().indexOf(url);
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

    const createMenuMessages = () => {
        return (
            <div
                ref={menuRef}
                className="absolute right-[120%] top-0 flex items-center rounded-xl"
            >
                <Button
                    variant="text"
                    size="small"
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
        if (showMenu) {
            const timer = setTimeout(() => handleHideMenu(), 2000);
            return () => clearTimeout(timer);
        }
    }, [showMenu]);

    return (
        <div
            key={msg._id}
            className={cn('relative mb-[2px] flex w-full ', {
                'justify-end': isOwnMsg,
                'justify-start': !isOwnMsg,
            })}
        >
            <div
                className={cn('flex', {
                    'flex-row-reverse': isOwnMsg,
                    '': !isOwnMsg,
                    'w-full items-center': !msg.conversation.group,
                })}
            >
                {/* Avatar */}
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
                                <img
                                    className={cn(
                                        'my-1 max-h-[70vh] max-w-[50%] cursor-pointer object-cover shadow-md md:max-h-full md:max-w-[70%]',
                                        {
                                            'rounded-xl rounded-l-md': isOwnMsg,
                                            'rounded-xl rounded-r-md':
                                                !isOwnMsg,
                                        }
                                    )}
                                    onClick={() => {
                                        handleClickImage(img.url, index);
                                    }}
                                    key={index}
                                    src={img.url}
                                    alt="image"
                                />
                            ))}
                        </div>
                    )}

                    <Tooltip
                        title={
                            'Gửi lúc ' +
                            FormatDate.formatISODateToTime(msg.createdAt)
                        }
                        arrow={true}
                    >
                        <>
                            {msg.text.length > 0 && (
                                <div
                                    className={cn(
                                        'relative flex max-w-[70%] items-center px-4 py-2 text-xs',
                                        {
                                            'items-end rounded-xl rounded-r-md bg-primary-2 text-white':
                                                isOwnMsg,
                                            'rounded-xl rounded-l-md bg-primary-1 dark:bg-dark-secondary-2':
                                                !isOwnMsg,
                                        }
                                    )}
                                    onClick={handleClickContent}
                                >
                                    {showMenu &&
                                        isOwnMsg &&
                                        createMenuMessages()}

                                    <div className="flex flex-col">
                                        <p>
                                            {msg.text
                                                .split(' ')
                                                .map((text, index) => {
                                                    // Kểm tra url
                                                    if (text.match(urlRegex)) {
                                                        return (
                                                            <a
                                                                key={index}
                                                                href={text}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className={cn(
                                                                    'underline',
                                                                    {
                                                                        'text-primary-1':
                                                                            isOwnMsg,
                                                                        'text-primary-2 dark:text-dark-primary-1':
                                                                            !isOwnMsg,
                                                                    }
                                                                )}
                                                            >
                                                                {text + ' '}
                                                            </a>
                                                        );
                                                    } else {
                                                        return (
                                                            <span key={index}>
                                                                {text + ' '}
                                                            </span>
                                                        );
                                                    }
                                                })}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {index == 0 &&
                                msg.sender._id === session?.user.id && (
                                    <span className="text-xs text-secondary-1">
                                        {msg.isRead && 'Đã xem'}
                                    </span>
                                )}
                        </>
                    </Tooltip>
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
