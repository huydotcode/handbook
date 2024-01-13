import { Button } from '@/components';
import Avatar from '@/components/Avatar';
import { useAppContext } from '@/context/AppContext';
import React from 'react';

interface Props {
    data: INotification;
}

const NotificationItem: React.FC<Props> = ({ data: notification }) => {
    const { handleAcceptFriend, handleDeclineFriend } = useAppContext();

    return (
        <>
            {notification.type == 'friend' && (
                <div className="flex items-center w-full hover:bg-light-100 p-2 dark:text-white dark:hover:bg-dark-500">
                    <div>
                        <p className="text-sm">
                            {notification.send.name} đã gửi cho bạn lời mời kết
                            bạn
                        </p>
                        <div className="mt-2 flex justify-end items-center">
                            <Button
                                className="bg-primary mr-2 hover:bg-blue-400"
                                size={'small'}
                                onClick={() =>
                                    handleAcceptFriend({
                                        notificationId: notification._id,
                                        senderId: notification.send._id,
                                    })
                                }
                            >
                                Chấp nhận
                            </Button>
                            <Button
                                className="bg-gray-200 hover:bg-gray-400 dark:bg-dark-200 dark:hover:bg-dark-300 dark:hover:bg-dark-100"
                                size={'small'}
                                onClick={() => {
                                    handleDeclineFriend({
                                        notificationId: notification._id,
                                        senderId: notification.send._id,
                                    });
                                }}
                            >
                                Từ chối
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
