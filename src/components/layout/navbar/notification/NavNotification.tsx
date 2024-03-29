'use client';
import { useApp } from '@/context';
import { Popover } from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Button from '../../../ui/Button';
import NotificationPopover from './NotificationPopover';
import { Badge } from '@mui/material';
import { Icons } from '@/components/ui';

interface Props {}

const NavNotification: React.FC<Props> = ({}) => {
    const { notifications } = useApp();
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
                <Button
                    className="relative h-10 w-10 rounded-xl transition-transform duration-500 hover:rotate-1 hover:bg-hover-2 dark:hover:bg-dark-hover-1"
                    variant={'custom'}
                >
                    {open ? (
                        <Badge
                            color="secondary"
                            badgeContent={notifications.length}
                            max={99}
                        >
                            <Icons.NotificationActive className="h-7 w-7" />
                        </Badge>
                    ) : (
                        <Badge
                            color="secondary"
                            badgeContent={notifications.length}
                            max={99}
                        >
                            <Icons.Notification className="h-7 w-7" />
                        </Badge>
                    )}
                </Button>
            </Popover>
        </>
    );
};
export default NavNotification;
