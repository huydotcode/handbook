'use client';
import Icons from '@/components/ui/Icons';
import React from 'react';
import NotificationItem from './NotificationItem';

interface Props {
    showMessage?: boolean;
    data: INotification[];
}

const NotificationList: React.FC<Props> = ({
    showMessage = true,
    data: notifications,
}) => {
    return (
        <>
            {notifications.map((notification) => {
                return (
                    <NotificationItem
                        key={notification._id}
                        data={notification}
                        showMessage={showMessage}
                    />
                );
            })}

            {showMessage && notifications.length == 0 && (
                <div className="flex h-[200px] w-full items-center justify-center dark:text-dark-primary-1">
                    <p>Không có thông báo nào</p>
                </div>
            )}
        </>
    );
};
export default NotificationList;
