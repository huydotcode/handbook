'use client';
import { Avatar } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import {
    NotificationMessage,
    NotificationType,
} from '@/enums/EnumNotification';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import ConversationService from '@/lib/services/conversation.service';
import NotificationService from '@/lib/services/notification.service';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import Icons from '../ui/Icons';

const NotificationItem = ({
    data: notification,
    showMessage = true,
}: {
    data: INotification;
    showMessage?: boolean;
}) => {
    const { data: session } = useSession();
    const { socket, socketEmitor } = useSocket();
    const { invalidateNotifications, invalidateFriends } =
        useQueryInvalidation();

    const [showRemove, setShowRemove] = useState(false);

    // Chấp nhận lời mời kết bạn // Xử lý phía người nhận
    const handleAcceptFriend = useCallback(async () => {
        try {
            const notificatonRequestAddFriend =
                await NotificationService.getTypeAcceptFriendByUser(
                    session?.user.id as string
                );

            if (!notificatonRequestAddFriend) {
                toast.error('Không tìm thấy thông báo. Vui lòng thử lại!');

                await invalidateNotifications(session?.user.id as string);

                return;
            }

            // Chấp nhận lời mời kết bạn
            const acceptSuccess = await NotificationService.acceptFriend({
                senderId: notification.sender._id,
                notificationId: notificatonRequestAddFriend._id,
            });

            if (!acceptSuccess) {
                toast.error('Chấp nhận lời mời kết bạn thất bại!');
                return;
            }

            const newConversation =
                await ConversationService.createAfterAcceptFriend({
                    userId: notification.receiver._id,
                    friendId: notification.sender._id,
                });

            if (!newConversation) {
                toast.error('Tạo cuộc trò chuyện thất bại!');
                return;
            }

            // Cập nhật lại danh sách bạn bè
            await invalidateNotifications(session?.user.id as string);
            await invalidateFriends(session?.user.id as string);

            //Tạo thông báo cho người gửi
            const notificationAcceptFriend =
                await NotificationService.createNotificationAcceptFriend({
                    senderId: notification.receiver._id,
                    receiverId: notification.sender._id,
                });

            if (socket && notificationAcceptFriend) {
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
            toast.error(
                'Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại!'
            );
        }
    }, [
        invalidateFriends,
        invalidateNotifications,
        notification,
        session?.user.id,
        socket,
        socketEmitor,
    ]);

    // Từ chối lời mời kết bạn
    const handleDeclineFriend = async () => {
        try {
            await NotificationService.declineFriend({
                notificationId: notification._id,
                senderId: notification.sender._id,
            });

            await invalidateNotifications(session?.user.id as string);
            await invalidateFriends(session?.user.id as string);
            toast.success('Đã từ chối lời mời kết bạn');
        } catch (error) {
            toast.error('Không thể từ chối lời mời kết bạn. Vui lòng thử lại!');
        }
    };

    const removeNotification = async () => {
        try {
            await NotificationService.deleteNotification(notification._id);

            await invalidateNotifications(session?.user.id as string);
            toast.success('Đã xóa thông báo');
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
                            notification.isRead && 'text-secondary-1'
                        )}
                    >
                        <strong>{notification.sender.name}</strong>{' '}
                        {notification.type ===
                            NotificationType.REQUEST_ADD_FRIEND && (
                            <span>
                                {NotificationMessage.REJECT_FRIEND_REQUEST}
                            </span>
                        )}
                        {notification.type ===
                            NotificationType.ACCEPT_FRIEND_REQUEST && (
                            <span>
                                {NotificationMessage.ACCEPT_FRIEND_REQUEST}
                            </span>
                        )}
                        {notification.type === NotificationType.FOLLOW_USER && (
                            <span>{NotificationMessage.FOLLOW_USER}</span>
                        )}
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
