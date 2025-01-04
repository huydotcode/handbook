'use client';
import { Button } from '@/components/ui';
import { markAllAsRead } from '@/lib/actions/notification.action';
import { getNotificationsKey } from '@/lib/queryKey';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';
import toast from 'react-hot-toast';
import NotificationItem from './NotificationItem';

interface Props {
    notifications: INotification[];
}

const NotificationPopover: React.FC<Props> = ({ notifications }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            queryClient.invalidateQueries({
                queryKey: getNotificationsKey(session?.user.id),
            });
        } catch (error) {
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    return (
        <div className="max-h-[50vh] min-h-[200px] w-[300px] overflow-x-hidden overflow-y-scroll px-4 py-2 dark:bg-dark-secondary-1">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold dark:text-dark-primary-1">
                    Thông báo
                </h1>

                <Button className="p-0" variant={'text'}>
                    <h5 onClick={handleMarkAllAsRead}>Đánh dấu đã đọc</h5>
                </Button>
            </div>

            {notifications.map((notification) => {
                return (
                    <NotificationItem
                        key={notification._id}
                        data={notification}
                    />
                );
            })}

            {notifications.length == 0 && (
                <div className="flex h-[200px] w-full items-center justify-center dark:text-dark-primary-1">
                    <p>Không có thông báo nào</p>
                </div>
            )}
        </div>
    );
};

export default NotificationPopover;
