'use client';
import { Avatar, Button, Icons } from '@/components/ui';
import socketEvent from '@/constants/socketEvent.constant';
import { useSocket } from '@/context';
import { MessageService } from '@/lib/services';
import { cn } from '@/lib/utils';
import TimeAgoConverted from '@/utils/timeConvert';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
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
    messagesInRoom: IMessage[];
}

const Message: React.FC<Props> = ({ data: msg, messagesInRoom }) => {
    const { data: session } = useSession();
    const { socket } = useSocket();
    const [showTime, setShowTime] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLFormElement>(null);

    const newDate = useMemo(
        () => new Date(msg.createdAt).toLocaleString(),
        [msg.createdAt]
    );

    const index = messagesInRoom.indexOf(msg);
    const isOwnMsg = msg.sender._id === session?.user.id;

    const handleShowMenu = () => setShowMenu(true);
    const handleHideMenu = () => setShowMenu(false);
    const handleClickContent = () => {
        setShowTime((prev) => !prev);
        handleShowMenu();
    };

    const handleDeleteMsg: FormEventHandler = async (e) => {
        e.preventDefault();
        if (!socket) return;

        const res = await MessageService.deleteMessage({ messageId: msg._id });
        const prevMsg = messagesInRoom[index - 1] || null;

        socket.emit(socketEvent.DELETE_MESSAGE, {
            currentMessage: msg,
            prevMessage: prevMsg,
        });

        if (!res) {
            toast.error('Xóa thất bại!', { id: 'delete-message' });
        }
    };

    useEffect(() => {
        if (showTime) {
            const timer = setTimeout(() => setShowTime(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showTime]);

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
                className={cn(
                    // `flex items-center justify-${isOwnMsg ? 'end mr-1' : 'start ml-1'} w-full`
                    'flex',
                    {
                        'flex-row-reverse': isOwnMsg,
                        '': !isOwnMsg,
                        'w-full items-center': !msg.conversation.group,
                    }
                )}
            >
                {/* Avatar */}
                {msg.conversation.group && (
                    <div
                        className={cn('flex h-full items-center py-2 ', {
                            'pr-2': !isOwnMsg,
                            'pl-2': isOwnMsg,
                        })}
                    >
                        <Avatar
                            imgSrc={msg.sender.avatar}
                            width={40}
                            height={40}
                        />
                    </div>
                )}

                <div
                    className={cn('flex w-full flex-col', {
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

                    <Tooltip
                        title={
                            <TimeAgoConverted
                                className={'text-xs'}
                                time={msg.createdAt}
                                textBefore="Đã gửi"
                                textAfter="trước"
                            />
                        }
                        arrow
                        enterDelay={1000}
                    >
                        <>
                            <div
                                className={cn(
                                    'relative flex max-w-[70%] items-center px-4 py-2',
                                    {
                                        'items-end rounded-xl rounded-r-md bg-primary-2 text-white':
                                            isOwnMsg,
                                        'rounded-xl rounded-l-md bg-primary-1 dark:bg-dark-secondary-2':
                                            !isOwnMsg,
                                    }
                                )}
                                onClick={handleClickContent}
                            >
                                {showMenu && isOwnMsg && (
                                    <form
                                        ref={menuRef}
                                        className="absolute right-[120%] top-0 flex items-center rounded-xl"
                                        onSubmit={handleDeleteMsg}
                                    >
                                        <Button
                                            variant="text"
                                            size="small"
                                            type="submit"
                                        >
                                            <Icons.Delete />
                                        </Button>
                                    </form>
                                )}
                                <p
                                    className={cn('text-xs', {
                                        'text-justify': msg.text.length > 100,
                                    })}
                                >
                                    {msg.text}
                                </p>
                            </div>
                        </>
                    </Tooltip>
                </div>
            </div>

            {showTime && (
                <p
                    className={cn('text-[10px]', {
                        'mr-1 text-end': isOwnMsg,
                        'ml-2 text-start': !isOwnMsg,
                    })}
                >
                    Đã gửi lúc {newDate}
                </p>
            )}
        </div>
    );
};
export default Message;
