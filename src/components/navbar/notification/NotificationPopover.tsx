import { useAppContext } from '@/context/AppContext';
import NotificationItem from './NotificationItem';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function NotificationPopover() {
    const { notifications, loadingNotifications } = useAppContext();

    return (
        <div className="min-h-[200px] max-h-[50vh] px-4 py-2 overflow-x-hidden overflow-y-scroll bg-transparent dark:bg-dark-200">
            <h1 className="text-xl font-bold dark:text-white">Thông báo</h1>

            {!loadingNotifications &&
                notifications.map((notification) => {
                    return <NotificationItem data={notification} />;
                })}

            {!loadingNotifications && notifications.length == 0 && (
                <div className="w-full h-[200px] flex items-center justify-center dark:text-white">
                    <p>Không có thông báo nào</p>
                </div>
            )}

            {loadingNotifications && (
                <div className="w-full h-[200px] flex items-center justify-center">
                    <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                </div>
            )}
        </div>
    );
}

export default NotificationPopover;
