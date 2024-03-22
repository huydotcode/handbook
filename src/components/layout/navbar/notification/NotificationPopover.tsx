'use client';
import { Button } from '@/components/ui';
import { useApp } from '@/context';
import { NotificationService } from '@/lib/services';
import toast from 'react-hot-toast';
import NotificationList from './NotificationList';

function NotificationPopover() {
    const { setNotifications } = useApp();

    const handleMarkAllAsRead = async () => {
        try {
            await NotificationService.markAllAsRead();

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );
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

            <NotificationList />
        </div>
    );
}

export default NotificationPopover;
