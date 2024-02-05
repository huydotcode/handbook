import { Button } from '@/components/ui';
import Avatar from '@/components/ui/Avatar';
import Icons from '@/components/ui/Icons';
import { useAppContext } from '@/context/AppContext';
import React from 'react';

interface Props {
    data: INotification;
    showMessage?: boolean;
}

const NotificationItem: React.FC<Props> = ({
    data: notification,
    showMessage = true,
}) => {
    const { handleAcceptFriend, handleDeclineFriend } = useAppContext();

    return (
        <>
            {notification.type == 'friend' && (
                <div className="flex w-full items-center p-2 hover:bg-light-100 dark:text-white dark:hover:bg-dark-500">
                    <div>
                        <p className="text-sm">
                            {notification.send.name}{' '}
                            {showMessage && 'đã gửi lời mời kết bạn'}
                        </p>
                        <div className="mt-2 flex items-center justify-end">
                            <Button
                                className="mr-2 bg-primary hover:bg-blue-400"
                                size={'small'}
                                onClick={() =>
                                    handleAcceptFriend({
                                        notificationId: notification._id,
                                        senderId: notification.send._id,
                                    })
                                }
                            >
                                {showMessage ? 'Chấp nhận' : <Icons.Tick />}
                            </Button>
                            <Button
                                className="dark:hover:bg-dark-300 bg-gray-200 hover:bg-gray-400 dark:bg-dark-200 dark:hover:bg-dark-100"
                                size={'small'}
                                onClick={() => {
                                    handleDeclineFriend({
                                        notificationId: notification._id,
                                        senderId: notification.send._id,
                                    });
                                }}
                            >
                                {showMessage ? 'Từ chối' : <Icons.Close />}
                            </Button>
                        </div>
                    </div>

                    <div className="ml-4">
                        <Avatar
                            width={40}
                            height={40}
                            imgSrc={notification.send.image}
                            userUrl={notification.send._id}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
export default NotificationItem;
