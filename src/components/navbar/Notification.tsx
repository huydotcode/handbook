'use client';
import { useNotifications } from '@/hooks';
import { Badge, MenuItem } from '@mui/material';
import { MdNotifications, MdNotificationsActive } from 'react-icons/md';
import Button from '../ui/Button';
import Popover, { usePopover } from '../ui/Popover';

const Notification = ({}) => {
    // const { anchorEl, handleClose, handleShow, open } = usePopover();
    // const { notifications, addNotification } = useNotifications({});
    // return (
    //     <>
    //         <Button
    //             className="relative w-10 h-10 rounded-full bg-secondary dark:bg-dark-500 hover:rotate-12 transition-transform duration-500"
    //             onClick={handleShow}
    //         >
    //             {open ? (
    //                 <Badge
    //                     color="secondary"
    //                     badgeContent={notifications.length}
    //                     max={99}
    //                 >
    //                     <MdNotificationsActive className="w-7 h-7" />
    //                 </Badge>
    //             ) : (
    //                 <Badge
    //                     color="secondary"
    //                     badgeContent={notifications.length}
    //                     max={99}
    //                 >
    //                     <MdNotifications className="w-7 h-7" />
    //                 </Badge>
    //             )}
    //         </Button>
    //         <Popover open={open} anchorEl={anchorEl} handleClose={handleClose}>
    //             <div className="text-xl font-bold border-b pb-1 dark:text-primary">
    //                 Thông báo
    //             </div>
    //             <ul className="pt-3 bg-transparent">
    //                 {notifications.map((noti, index) => {
    //                     return <MenuItem key={index}>{noti.message}</MenuItem>;
    //                 })}
    //                 {notifications.length === 0 && (
    //                     <p className="dark:text-primary">
    //                         Không có thông báo nào
    //                     </p>
    //                 )}
    //             </ul>
    //         </Popover>
    //     </>
    // );
};
export default Notification;
