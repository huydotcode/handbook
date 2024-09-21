'use client';
import { Button } from '@/components/ui';
import Avatar from '@/components/ui/Avatar';
import Icons from '@/components/ui/Icons';
import socketEvent from '@/constants/socketEvent.constant';
import { useApp, useSocket } from '@/context';
import { NotificationService } from '@/lib/services';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    data: INotification;
    showMessage?: boolean;
}

const NotificationItem: React.FC<Props> = ({
    data: notification,
    showMessage = true,
}) => {
    const { socket } = useSocket();
    const { notifications, setNotifications } = useApp();
    const [showRemove, setShowRemove] = useState(false);

    // Chấp nhận lời mời kết bạn
    const handleAcceptFriend = useCallback(async () => {
        if (!notification) return;

        try {
            const notificationAcceptFriend =
                await NotificationService.acceptFriend({ notification });

            setNotifications((prev) =>
                prev.filter((item) => item._id !== notification._id)
            );

            if (socket) {
                socket.emit(socketEvent.RECEIVE_NOTIFICATION, {
                    notification: notificationAcceptFriend,
                });
            }
        } catch (error) {
            toast.error(
                'Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại!'
            );
        }
    }, [notification, socket]);

    // Từ chối lời mời kết bạn
    const handleDeclineFriend = async () => {
        try {
            await NotificationService.declineFriend({ notification });

            setNotifications(
                notifications.filter((item) => item._id !== notification._id)
            );
        } catch (error) {
            toast.error('Không thể từ chối lời mời kết bạn. Vui lòng thử lại!');
        }
    };

    const removeNotification = async () => {
        try {
            await NotificationService.removeNotification({
                notificationId: notification._id,
            });

            setNotifications((prev) =>
                prev.filter((item) => item._id !== notification._id)
            );
        } catch (error) {
            toast.error('Không thể xóa thông báo. Vui lòng thử lại!');
        }
    };

    return (
        <>
            <div
                className="relative flex w-full items-center p-2"
                onMouseEnter={() => setShowRemove(true)}
                onMouseLeave={() => setShowRemove(false)}
            >
                <div className="mr-4">
                    <Avatar
                        width={40}
                        height={40}
                        imgSrc={notification.sender.avatar}
                        userUrl={notification.sender._id}
                    />
                </div>

                <div>
                    <p
                        className={cn(
                            'text-sm dark:text-dark-primary-1',
                            notification.isRead && 'text-secondary-2'
                        )}
                    >
                        <strong>{notification.sender.name}</strong>{' '}
                        {showMessage && notification.message}
                    </p>
                    {notification.type === 'request-add-friend' && (
                        <div className="mt-2 flex items-center">
                            <Button
                                className="mr-2"
                                variant={'primary'}
                                size={'small'}
                                onClick={handleAcceptFriend}
                            >
                                {showMessage ? 'Chấp nhận' : <Icons.Tick />}
                            </Button>
                            <Button
                                className=""
                                size={'small'}
                                onClick={handleDeclineFriend}
                            >
                                {showMessage ? 'Từ chối' : <Icons.Close />}
                            </Button>
                        </div>
                    )}
                </div>

                <Button
                    className={cn(
                        'absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 transition-all duration-200 ease-in-out',
                        !showRemove && 'opacity-0',
                        showRemove && 'opacity-100'
                    )}
                    onClick={removeNotification}
                >
                    <Icons.Close />
                </Button>
            </div>
        </>
    );
};
export default NotificationItem;
