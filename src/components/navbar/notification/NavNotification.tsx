'use client';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@mui/material';
import { Popover } from 'antd';
import { useState } from 'react';
import { MdNotifications, MdNotificationsActive } from 'react-icons/md';
import Button from '../../ui/Button';
import NotificationPopover from './NotificationPopover';

const NavNotification = () => {
    const { notifications } = useAppContext();
    const [open, setOpen] = useState(false);

    return (
        <>
            <Popover
                placement="bottomLeft"
                content={NotificationPopover}
                trigger="click"
                onOpenChange={(open) => setOpen(open)}
                overlayInnerStyle={{ padding: 0 }}
            >
                <Button className="relative w-10 h-10 rounded-full bg-secondary dark:bg-dark-500 hover:rotate-12 transition-transform duration-500 ">
                    {open ? (
                        <Badge
                            color="secondary"
                            badgeContent={notifications.length}
                            max={99}
                        >
                            <MdNotificationsActive className="w-7 h-7" />
                        </Badge>
                    ) : (
                        <Badge
                            color="secondary"
                            badgeContent={notifications.length}
                            max={99}
                        >
                            <MdNotifications className="w-7 h-7" />
                        </Badge>
                    )}
                </Button>
            </Popover>
        </>
    );
};
export default NavNotification;
