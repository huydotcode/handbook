'use client';
import Icons from '@/components/ui/Icons';
import { useApp } from '@/context';
import React from 'react';
import NotificationItem from './NotificationItem';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/context/AppContext';

interface Props {
    showMessage?: boolean;
}

const NotificationList: React.FC<Props> = ({ showMessage = true }) => {
    const { data: session } = useSession();
    if (!session) return null;
    const { data: notifications, isLoading } = useNotifications(
        session?.user?.id
    );
    if (!notifications) return null;

    return (
        <>
            {notifications &&
                notifications.map((notification) => {
                    return (
                        <NotificationItem
                            key={notification._id}
                            data={notification}
                            showMessage={showMessage}
                        />
                    );
                })}

            {showMessage && !isLoading && notifications.length == 0 && (
                <div className="flex h-[200px] w-full items-center justify-center dark:text-dark-primary-1">
                    <p>Không có thông báo nào</p>
                </div>
            )}

            {isLoading && (
                <div className="flex h-[200px] w-full items-center justify-center">
                    <Icons.Loading className="animate-spin text-xl dark:text-dark-primary-1" />
                </div>
            )}
        </>
    );
};
export default NotificationList;
