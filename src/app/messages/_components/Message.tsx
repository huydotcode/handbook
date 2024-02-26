'use client';
import { Button, Icons } from '@/components/ui';
import { useSocket } from '@/context';
import { useChat } from '@/context/ChatContext';
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
    const { setMessages } = useChat();
    const { socket } = useSocket();
    const [showTime, setShowTime] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const newDate = new Date(msg.createdAt).toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
    });

    const menuRef = useRef<HTMLFormElement>(null);

    const canShowTime = useMemo(() => {
        // Kiểm tra xem tin nhắn trước và sau có phải của cùng 1 người không
        return (
            messagesInRoom[messagesInRoom.indexOf(msg) - 1]?.userId !==
                msg.userId &&
            messagesInRoom[messagesInRoom.indexOf(msg) + 1]?.userId ===
                msg.userId
        );
    }, []);

    const topAndBottomMsgIsNotSameUser = useMemo(() => {
        return (
            messagesInRoom[messagesInRoom.indexOf(msg) - 1]?.userId !==
                msg.userId &&
            messagesInRoom[messagesInRoom.indexOf(msg) + 1]?.userId !==
                msg.userId
        );
    }, []);

    const isOwnMsg = msg.userId === session?.user.id;

    const handleShowMenu = () => setShowMenu(true);
    const handleHideMenu = () => setShowMenu(false);
    const handleClickContent = () => {
        setShowTime((prev) => !prev);
        handleShowMenu();
    };
    const handleDeleteMsg: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!socket) return;

        const res = await MessageService.deleteMessage({
            messageId: msg._id,
        });

        socket.emit('delete-message', msg);

        if (res) {
            setMessages((prev) => prev.filter((cmt) => cmt._id !== msg._id));
        } else {
            toast.error('Xóa thất bại!', {
                id: 'delete-message',
            });
        }
    };

    useEffect(() => {
        if (showTime) {
            const timer = setTimeout(() => {
                setShowTime(false);
            }, 2000);

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

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [menuRef.current]);

    useEffect(() => {
        if (showMenu) {
            setTimeout(() => {
                handleHideMenu();
            }, 2000);
        }
    }, [showMenu]);

    return (
        <div
            key={msg._id}
            className={cn(
                'relative mb-[2px] flex w-full flex-col items-center',
                {
                    'justify-end': isOwnMsg,
                    'justify-start': !isOwnMsg,
                }
            )}
        >
            {canShowTime ||
                (topAndBottomMsgIsNotSameUser && !isOwnMsg && (
                    <div className="ml-2 text-[10px]">{newDate}</div>
                ))}

            <div
                className={cn(
                    `flex items-center justify-${
                        isOwnMsg ? 'end mr-1' : 'start ml-1'
                    } w-full`
                )}
            >
                <Tooltip
                    title={
                        <TimeAgoConverted
                            className={'text-xs  '}
                            time={msg.createdAt}
                            textBefore="Đã gửi"
                            textAfter="trước"
                        />
                    }
                    arrow
                    enterDelay={1000}
                >
                    <div
                        className={cn(
                            `relative flex w-fit max-w-[70%] items-center  px-4 py-2 `,
                            {
                                'items-end rounded-xl rounded-r-md bg-primary-2 text-white':
                                    isOwnMsg,
                                ' rounded-xl rounded-l-md bg-primary-1 dark:bg-dark-secondary-2':
                                    !isOwnMsg,
                            }
                        )}
                        onClick={handleClickContent}
                    >
                        {showMenu && isOwnMsg && (
                            <form
                                ref={menuRef}
                                className={
                                    ' absolute right-[120%] top-0 flex items-center rounded-xl'
                                }
                                onSubmit={handleDeleteMsg}
                            >
                                <Button
                                    variant={'text'}
                                    size={'small'}
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
                </Tooltip>

                {/* {msg.isRead &&
                    isLastMessage &&
                    session?.user.id === msg.userId && (
                        <Avatar
                            className={'w-4 h-4 ml-2 mt-2'}
                            imgSrc={currentRoom.image || ''}
                        />
                    )} */}
            </div>
        </div>
    );
};
export default Message;
