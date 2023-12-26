import { Button } from '@/components';
import Avatar from '@/components/Avatar';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { deleteMessage } from '@/lib/actions/message.action';
import TimeAgoConverted from '@/utils/timeConvert';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { FormEventHandler, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    data: IMessage;
}

const Message: React.FC<Props> = ({ data: msg }) => {
    const { data: session } = useSession();
    const { currentRoom, messages, setMessages } = useChat();
    const { socket } = useSocket();
    const [showTime, setShowTime] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

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
            toast.success('Xóa thành công!');
            setMessages((prev) => prev.filter((cmt) => cmt._id !== msg._id));
        } else {
            toast.error('Xóa thất bại!');
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
            className={`relative flex items-center justify-${
                isOwnMsg ? 'end' : 'start'
            } mb-2 w-full `}
            onMouseEnter={handleShowMenu}
            onMouseLeave={handleHideMenu}
        >
            <div
                className={`flex flex-col items-${
                    isOwnMsg ? 'end' : 'start'
                } w-full`}
            >
                <div
                    className={`relative flex items-center ${
                        isOwnMsg ? 'items-end bg-blue-500' : 'bg-dark-500'
                    } text-white px-4 py-2 rounded-xl max-w-[40%]`}
                    onClick={handleToggleShowTime}
                >
                    {showMenu && isOwnMsg && (
                        <form
                            className={'absolute right-[120%]'}
                            onSubmit={handleDeleteMsg}
                        >
                            <Button
                                variant={'text'}
                                size={'small'}
                                type="submit"
                            >
                                Xóa
                            </Button>
                        </form>
                    )}

                    <p className="text-xs">{msg.text}</p>
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
                            className={'w-6 h-6 ml-2 mt-2'}
                            imgSrc={currentRoom.image || ''}
                        />
                    )}
            </div>
        </div>
    );
};
export default Message;
