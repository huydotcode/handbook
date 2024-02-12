'use client';
import { Button, Icons } from '@/components/ui';
import React from 'react';

interface Props {}

const NotificationList: React.FC<Props> = ({}) => {
    const haveNotificationFriend = true;
    const handleToggleShow = () => {};

    return (
        <div>
            {haveNotificationFriend && (
                <>
                    <div className="flex items-center justify-between px-2">
                        <h1 className="text-md p-2 font-bold">
                            Lời mời kết bạn
                        </h1>
                        <Button
                            className="lg:hidden"
                            onClick={handleToggleShow}
                        >
                            <Icons.ArrowDown />
                        </Button>
                    </div>

                    {/* <NotificationList showMessage={false} /> */}
                </>
            )}
        </div>
    );
};
export default NotificationList;
