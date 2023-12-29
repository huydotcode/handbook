import { Button } from '@/components';
import Avatar from '@/components/Avatar';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { deleteMessage } from '@/lib/actions/message.action';
import { cn } from '@/lib/utils';
import TimeAgoConverted from '@/utils/timeConvert';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { FormEventHandler, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';

interface Props {
    data: IMessage;
}

const Message: React.FC<Props> = ({ data: msg }) => {
    const { data: session } = useSession();
    const { currentRoom, messages, setMessages, messagesInRoom } = useChat();
    const { socket } = useSocket();
    const [showTime, setShowTime] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const topAndBottomMsgIsSameUser =
        messagesInRoom[messagesInRoom.indexOf(msg) - 1]?.userId ===
            msg.userId &&
        messagesInRoom[messagesInRoom.indexOf(msg) + 1]?.userId === msg.userId;

    const bottomMsgIsSameUser = useMemo(() => {
        return (
            messagesInRoom[messagesInRoom.indexOf(msg) + 1]?.userId ===
            msg.userId
        );
    }, [messagesInRoom, msg]);

    const isLastMessage = useMemo(() => {
        return messages[messages.length - 1]._id === msg._id;
    }, [messages, msg]);

    // is user cmt
    const isOwnMsg = msg.userId === session?.user.id;

    const handleToggleShowTime = () => setShowTime((prev) => !prev);
    const handleShowMenu = () => setShowMenu(true);
    const handleHideMenu = () => setShowMenu(false);

    const handleDeleteMsg: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!socket) return;

        const res = await deleteMessage({
            messageId: msg._id,
        });

        socket.emit('delete-message', msg);

        if (res) {
            toast.success('Xóa thành công!', {
                id: 'delete-message',
            });
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

    return (
        <div
            key={msg._id}
            className={cn('relative flex items-center mb-2 w-full', {
                'justify-end': isOwnMsg,
                'justify-start': !isOwnMsg,
                'mb-[1px]': topAndBottomMsgIsSameUser || bottomMsgIsSameUser,
            })}
            onMouseEnter={handleShowMenu}
            onMouseLeave={handleHideMenu}
        >
            <div
                className={`flex flex-col items-${
                    isOwnMsg ? 'end' : 'start'
                } w-full`}
            >
                <div
                    className={cn(
                        `relative flex items-center  text-white px-4 py-2 w-fit max-w-[70%]`,
                        {
                            'items-end bg-blue-500 rounded-l-xl rounded-r-sm':
                                isOwnMsg,
                            'bg-light-100 text-black rounded-l-sm rounded-r-xl dark:bg-dark-500 dark:text-white':
                                !isOwnMsg,
                        }
                    )}
                    onClick={handleToggleShowTime}
                >
                    {showMenu && isOwnMsg && (
                        <form
                            className={
                                'absolute flex items-center bottom-0 h-full right-[120%] bg-light-100 rounded-xl text-white dark:bg-dark-500 dark:text-white'
                            }
                            onSubmit={handleDeleteMsg}
                        >
                            <Button
                                variant={'text'}
                                size={'small'}
                                type="submit"
                            >
                                <MdDelete />
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

                {showTime && (
                    <>
                        <TimeAgoConverted
                            className={
                                'text-xs text-gray-500 dark:text-gray-400'
                            }
                            time={msg.createdAt}
                        />
                    </>
                )}

                {msg.isRead &&
                    isLastMessage &&
                    session?.user.id === msg.userId && (
                        <Avatar
                            className={'w-4 h-4 ml-2 mt-2'}
                            imgSrc={currentRoom.image || ''}
                        />
                    )}
            </div>
        </div>
    );
};
export default Message;
