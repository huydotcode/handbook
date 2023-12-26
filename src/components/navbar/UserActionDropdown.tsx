'use client';
import { userActions } from '@/constants/actions';
import Image from 'next/image';
import Link from 'next/link';
import { SetStateAction, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

import { MenuItem, Tooltip } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Popover, { usePopover } from '../ui/Popover';
import Button from '../ui/Button';
import { useSocket } from '@/context/SocketContext';

const UserActionDropdown = () => {
    const { data: session } = useSession();
    const [history, setHistory] = useState([{ data: userActions as any }]);
    const currentHistory = history[history.length - 1] as any;

    const user = session?.user as ISessionUser;
    const { open, anchorEl, handleClose, handleShow } = usePopover();
    const { socket } = useSocket();

    const handleLogout = () => {
        signOut();
        if (socket) {
            socket.disconnect();
        }
    };

    return (
        <>
            <Tooltip title="Tài khoản của bạn">
                <Button
                    variant={'custom'}
                    onClick={handleShow}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Image
                        className="rounded-full cursor-pointer"
                        width={40}
                        height={40}
                        src={(session?.user && session?.user.image) || ''}
                        alt="Your profile picture"
                        referrerPolicy="no-referrer"
                    />
                </Button>
            </Tooltip>

            <Popover open={open} anchorEl={anchorEl} handleClose={handleClose}>
                <div className="relative flex flex-col min-w-[300px] text-primary dark:text-dark-100">
                    <div className="flex items-center p-2 w-full">
                        {currentHistory == history[0] ? (
                            <Link
                                className="flex items-center w-full p-2 rounded-xl  shadow-md  text-primary hover:bg-light-100 dark:text-dark-100 dark:hover:bg-dark-500 "
                                onClick={handleClose}
                                href={`/profile/${user.id}`}
                            >
                                <div className="w-9 h-9 object-cover">
                                    <Image
                                        className="rounded-full"
                                        width={40}
                                        height={40}
                                        src={user?.image || ''}
                                        alt={user?.name || ''}
                                    />
                                </div>
                                <span className="ml-2 text-lg text-dark-100 dark:text-primary">
                                    {user?.name}
                                </span>
                            </Link>
                        ) : (
                            <>
                                <Button
                                    className="bg-transparent p-3 mr-2 dark:text-primary dark:hover:bg-dark-500"
                                    onClick={() =>
                                        setHistory((prev) =>
                                            prev.slice(0, prev.length - 1)
                                        )
                                    }
                                >
                                    <FaArrowLeft className="text-base" />
                                </Button>
                                <span className="text-dark-100 dark:text-primary">
                                    {currentHistory.title}
                                </span>
                            </>
                        )}
                    </div>

                    <ul className="pt-3 bg-transparent">
                        {currentHistory.data.map((item: any, index: number) => {
                            const handleClick = () => {
                                if (item.action) {
                                    item.action();
                                }
                                if (item.children) {
                                    setHistory((prev: SetStateAction<any>) => [
                                        ...prev,
                                        item.children,
                                    ]);
                                }

                                if (!item.children) {
                                    handleClose();
                                }
                            };

                            return (
                                <MenuItem
                                    className="relative flex items-center w-full h-[52px] rounded-xl px-2 cursor-pointer dark:hover:bg-dark-500"
                                    key={item.title}
                                    onClick={handleClick}
                                >
                                    {/* Icon */}
                                    {item.icon && (
                                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#e4e6eb] mr-2 text-2xl text-black">
                                            {item.icon()}
                                        </span>
                                    )}

                                    {/* Title */}
                                    {item.title && (
                                        <h5 className="ml-2 text-base font-semibold text-dark-100 dark:text-primary">
                                            {item.title}
                                        </h5>
                                    )}

                                    {/* {item.button && item.button()} */}

                                    {item.children && (
                                        <MdOutlineKeyboardArrowRight className="absolute right-2 text-2xl text-dark-100 dark:text-primary" />
                                    )}
                                </MenuItem>
                            );
                        })}

                        <Button
                            variant={'event'}
                            size={'medium'}
                            onClick={handleLogout}
                        >
                            Đăng xuất 2
                        </Button>
                    </ul>
                </div>
            </Popover>
        </>
    );
};

export default UserActionDropdown;
