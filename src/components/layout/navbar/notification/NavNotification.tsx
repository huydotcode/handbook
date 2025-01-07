'use client';
import { useNotifications } from '@/context/AppContext';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import { Button } from '@/components/ui/Button';
import { useQueryClient } from '@tanstack/react-query';
import { markAllAsRead } from '@/lib/actions/notification.action';
import { getNotificationsKey } from '@/lib/queryKey';
import toast from 'react-hot-toast';
import NotificationItem from '@/components/layout/navbar/notification/NotificationItem';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui';

interface Props {}

const NavNotification: React.FC<Props> = ({}) => {
    const { data: session } = useSession();
    const { data: notifications } = useNotifications(session?.user?.id);
    const [open, setOpen] = useState(false);
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

    if (!notifications) return null;

    return (
        <>
            <Popover
                onOpenChange={() => {
                    setOpen(!open);
                }}
            >
                <PopoverTrigger asChild>
                    <Button
                        className={'relative'}
                        size={'sm'}
                        variant={'ghost'}
                    >
                        {open ? (
                            <Icons.NotificationActive className="h-7 w-7" />
                        ) : (
                            <Icons.Notification className="h-7 w-7" />
                        )}

                        <Badge
                            className="absolute bottom-0 right-0 px-1 py-0 text-xs font-light"
                            variant={'secondary'}
                        >
                            {notifications.filter((n) => !n.isRead).length}
                        </Badge>
                    </Button>
                </PopoverTrigger>

                <PopoverContent asChild>
                    <div className="max-h-[50vh] min-h-[200px] w-[300px] overflow-x-hidden overflow-y-scroll px-4 py-2 dark:bg-dark-secondary-1">
                        <div className="flex items-center justify-between">
                            <h1 className="text font-bold dark:text-dark-primary-1">
                                Thông báo
                            </h1>

                            <Button
                                className="p-0"
                                size={'xs'}
                                variant={'text'}
                            >
                                <h5 onClick={handleMarkAllAsRead}>
                                    Đánh dấu đã đọc
                                </h5>
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
                </PopoverContent>
            </Popover>
        </>
    );
};
export default NavNotification;
