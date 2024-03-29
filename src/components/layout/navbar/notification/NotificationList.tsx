'use client';
import Icons from '@/components/ui/Icons';
import { useApp } from '@/context';
import React from 'react';
import NotificationItem from './NotificationItem';

interface Props {
    showMessage?: boolean;
}

const NotificationList: React.FC<Props> = ({ showMessage = true }) => {
    const { notifications, loadingNotifications } = useApp();

    return (
        <>
            {!loadingNotifications &&
                notifications.map((notification) => {
                    return (
                        <NotificationItem
                            key={notification._id}
                            data={notification}
                            showMessage={showMessage}
                        />
                    );
                })}

            {showMessage &&
                !loadingNotifications &&
                notifications.length == 0 && (
                    <div className="flex h-[200px] w-full items-center justify-center dark:text-dark-primary-1">
                        <p>Không có thông báo nào</p>
                    </div>
                )}

            {loadingNotifications && (
                <div className="flex h-[200px] w-full items-center justify-center">
                    <Icons.Loading className="animate-spin text-xl dark:text-dark-primary-1" />
                </div>
            )}
        </>
    );
};
export default NotificationList;
