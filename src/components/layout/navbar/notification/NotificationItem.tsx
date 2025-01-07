'use client';
import Avatar from '@/components/ui/Avatar';
import Icons from '@/components/ui/Icons';
import { useSocket } from '@/context';
import { createConversationAfterAcceptFriend } from '@/lib/actions/conversation.action';
import {
    acceptFriend,
    createNotificationAcceptFriend,
    declineFriend,
    deleteNotification,
    getNotificationAddFriendByUserId,
} from '@/lib/actions/notification.action';
import { getConversationsKey, getNotificationsKey } from '@/lib/queryKey';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface Props {
    data: INotification;
    showMessage?: boolean;
}

const NotificationItem: React.FC<Props> = ({
    data: notification,
    showMessage = true,
}) => {
    const { data: session } = useSession();
    const { socket, socketEmitor } = useSocket();
    const queryClient = useQueryClient();

    const [showRemove, setShowRemove] = useState(false);

    // Chấp nhận lời mời kết bạn // Xử lý phía người nhận
    const handleAcceptFriend = useCallback(async () => {
        try {
            const notificatonRequestAddFriend =
                await getNotificationAddFriendByUserId({
                    receiverId: notification.receiver._id,
                });

            if (!notificatonRequestAddFriend) {
                toast.error('Không tìm thấy thông báo. Vui lòng thử lại!');

                queryClient.invalidateQueries({
                    queryKey: getNotificationsKey(session?.user.id),
                });

                return;
            }

            // Chấp nhận lời mời kết bạn
            const acceptSuccess = await acceptFriend({
                notification,
            });

            queryClient.invalidateQueries({
                queryKey: getNotificationsKey(session?.user.id),
            });

            if (!acceptSuccess) {
                toast.error('Chấp nhận lời mời kết bạn thất bại!');
                return;
            }

            const newConversation = await createConversationAfterAcceptFriend({
                userId: notification.receiver._id,
                friendId: notification.sender._id,
            });

            queryClient.invalidateQueries({
                queryKey: getConversationsKey(notification.receiver._id),
            });

            //Tạo thông báo cho người gửi
            const notificationAcceptFriend =
                await createNotificationAcceptFriend({
                    type: 'accept-friend',
                    senderId: notification.receiver._id,
                    receiverId: notification.sender._id,
                    message: 'Đã chấp nhận lời mời kết bạn',
                });

            if (socket) {
                // Join room
                socketEmitor.joinRoom({
                    roomId: newConversation._id,
                    userId: notification.receiver._id,
                });

                socketEmitor.joinRoom({
                    roomId: newConversation._id,
                    userId: notification.sender._id,
                });

                // Gửi thông báo cho người gửi
                socketEmitor.receiveNotification({
                    notification: notificationAcceptFriend,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(
                'Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại!'
            );
        }
    }, [notification, queryClient, session?.user.id, socket, socketEmitor]);

    // Từ chối lời mời kết bạn
    const handleDeclineFriend = async () => {
        try {
            await declineFriend({ notification });

            queryClient.invalidateQueries({
                queryKey: getNotificationsKey(session?.user.id),
            });
        } catch (error) {
            toast.error('Không thể từ chối lời mời kết bạn. Vui lòng thử lại!');
        }
    };

    const removeNotification = async () => {
        try {
            await deleteNotification({
                notificationId: notification._id,
            });

            queryClient.invalidateQueries({
                queryKey: getNotificationsKey(session?.user.id),
            });
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
                                size={'sm'}
                                onClick={handleAcceptFriend}
                            >
                                {showMessage ? 'Chấp nhận' : <Icons.Tick />}
                            </Button>
                            <Button size={'sm'} onClick={handleDeclineFriend}>
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
