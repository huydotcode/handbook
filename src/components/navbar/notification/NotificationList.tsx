import { useAppContext } from '@/context/AppContext';
import React from 'react';
import NotificationItem from './NotificationItem';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Props {
    showMessage?: boolean;
}

const NotificationList: React.FC<Props> = ({ showMessage = true }) => {
    const { loadingNotifications, notifications } = useAppContext();

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
                    <div className="w-full h-[200px] flex items-center justify-center dark:text-white">
                        <p>Không có thông báo nào</p>
                    </div>
                )}

            {loadingNotifications && (
                <div className="w-full h-[200px] flex items-center justify-center">
                    <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                </div>
            )}
        </>
    );
};
export default NotificationList;
