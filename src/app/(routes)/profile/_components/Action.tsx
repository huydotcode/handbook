'use client';
import { Button } from '@/components/ui';
import Icons from '@/components/ui/Icons';
import socketEvent from '@/constants/socketEvent.constant';
import { useSocial, useSocket } from '@/context';
import { NotificationService, UserService } from '@/lib/services';
import logger from '@/utils/logger';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    userId: string;
}

const Action: React.FC<Props> = ({ userId }) => {
    const { socket } = useSocket();
    const { friends, setFriends } = useSocial();
    const [isRequest, setIsRequest] = useState<boolean>(false);
    const [countClick, setCountClick] = useState<number>(0);

    const isFriend = useMemo(
        () => friends && friends.some((friend) => friend._id === userId),
        [friends, userId]
    );

    // Kiểm tra xem có thể gửi lời mời kết bạn không
    const checkCanRequestAddFriend = async () => {
        const canRequest = await NotificationService.canRequestAddFriend({
            userId,
        });

        setIsRequest(!canRequest);

        return canRequest;
    };

    const addFriend = async () => {
        if (isRequest) return;

        try {
            const requestAddFriend =
                await NotificationService.sendRequestAddFriend({
                    receiverId: userId,
                });

            setIsRequest(true);

            if (socket) {
                socket.emit(socketEvent.SEND_REQUEST_ADD_FRIEND, {
                    request: requestAddFriend,
                });
            }

            toast.success('Đã gửi lời mời kết bạn');
        } catch (error) {
            logger({
                message: 'Error handle add friend: ' + error,
                type: 'error',
            });
            toast.error('Đã có lỗi xảy ra khi gửi lời mời kết bạn!');
            setIsRequest(false);
        }
    };

    const removeFriend = async () => {
        try {
            await UserService.unfriend({ friendId: userId });
            setFriends((prev) =>
                prev.filter((friend) => friend._id !== userId)
            );
            toast.success('Đã hủy kết bạn');
        } catch (error) {
            logger({
                message: 'Error handle remove friend: ' + error,
                type: 'error',
            });
            toast.error('Đã có lỗi xảy ra khi hủy kết bạn!');
        }
    };

    const getButtonText = () => {
        if (isFriend) return 'Hủy kết bạn';
        if (isRequest) return 'Đã gửi lời mời kết bạn';
        return 'Kết bạn';
    };

    const handleAddFriend = () => {
        setCountClick((prev) => prev + 1);

        if (countClick === 5) {
            toast.error('Chậm lạiii đi bạn....');

            setTimeout(() => {
                setCountClick(0);
            }, 5000);

            return;
        }

        if (isFriend) {
            removeFriend();
        } else {
            addFriend();
        }
    };

    useEffect(() => {
        checkCanRequestAddFriend();
    }, []);

    useEffect(() => {
        if (isFriend) {
            setIsRequest(false);
        }
    }, [isFriend]);

    return (
        <div className="flex items-center">
            <Button
                className="mr-2 h-12 min-w-[48px]"
                variant="primary"
                size="medium"
            >
                <Icons.Message />
                <p className="ml-2 md:hidden">Nhắn tin</p>
            </Button>

            <Button
                className="h-12 min-w-[48px]"
                variant="secondary"
                size="medium"
                onClick={handleAddFriend}
            >
                {isFriend ? <Icons.Users /> : <Icons.PersonAdd />}
                <p className="ml-2 md:hidden">{getButtonText()}</p>
            </Button>
        </div>
    );
};

export default Action;
