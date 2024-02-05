import NotificationList from './NotificationList';

function NotificationPopover() {
    return (
        <div className="max-h-[50vh] min-h-[200px] overflow-x-hidden overflow-y-scroll bg-transparent px-4 py-2 dark:bg-dark-200">
            <h1 className="text-xl font-bold dark:text-white">Thông báo</h1>

            <NotificationList />
        </div>
    );
}

export default NotificationPopover;
