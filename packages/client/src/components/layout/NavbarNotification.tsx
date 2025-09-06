'use client';
import { SkeletonAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/context/AppContext';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import NotificationService from '@/lib/services/notification.service';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Icons from '../ui/Icons';
import NotificationItem from './NotificationItem';

const NavbarNotification = () => {
    const { data: session } = useSession();
    const { data: notifications, isLoading } = useNotifications(
        session?.user?.id
    );
    const unreadCount = notifications
        ? notifications.filter((n) => !n.isRead).length
        : 0;

    const { invalidateNotifications } = useQueryInvalidation();
    const [open, setOpen] = useState(false);

    const handleMarkAllAsRead = async () => {
        try {
            await NotificationService.markAllAsRead();
            await invalidateNotifications(session?.user.id as string);
        } catch (error) {
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

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

                        {unreadCount > 0 && (
                            <Badge
                                className="absolute bottom-0 right-0 px-1 py-0 text-xs font-light"
                                variant={'secondary'}
                            >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent asChild>
                    <div className="max-h-[50vh] min-h-[300px] w-[300px] overflow-x-hidden overflow-y-scroll px-4 py-2">
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

                        {notifications &&
                            notifications.map((notification) => {
                                return (
                                    <NotificationItem
                                        key={notification._id}
                                        data={notification}
                                    />
                                );
                            })}

                        {notifications &&
                            notifications.length == 0 &&
                            !isLoading && (
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

export default NavbarNotification;
