import NotificationList from './NotificationList';

function NotificationPopover() {
    return (
        <div className="min-h-[200px] max-h-[50vh] px-4 py-2 overflow-x-hidden overflow-y-scroll bg-transparent dark:bg-dark-200">
            <h1 className="text-xl font-bold dark:text-white">Thông báo</h1>

            <NotificationList />
        </div>
    );
}

export default NotificationPopover;
