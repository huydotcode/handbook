'use client';
import Image from 'next/image';
import Link from 'next/link';
import { SetStateAction, useState } from 'react';

import { MenuItem, Tooltip } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Button from '../../ui/Button';
import Icons from '../../ui/Icons';
import Popover, { usePopover } from '../../ui/Popover';

const UserActionDropdown = () => {
    const { data: session } = useSession();
    const [history, setHistory] = useState([{ data: [] as any }]);
    const currentHistory = history[history.length - 1] as any;

    const user = session?.user as ISessionUser;
    const { open, anchorEl, setAnchorEl, handleClose, handleShow } =
        usePopover();

    const handleLogout = async () => {
        await signOut();
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
                        className="cursor-pointer rounded-full"
                        width={40}
                        height={40}
                        src={(session?.user && session?.user.image) || ''}
                        alt="Your profile picture"
                        referrerPolicy="no-referrer"
                    />
                </Button>
            </Tooltip>

            <Popover
                open={open}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                handleClose={handleClose}
            >
                <div className="relative flex min-w-[300px] flex-col">
                    <div className="flex w-full items-center p-2">
                        {currentHistory == history[0] ? (
                            <Link
                                className="flex w-full items-center rounded-xl p-2 shadow-md hover:bg-hover-2 dark:text-dark-primary-1 dark:hover:bg-dark-hover-1"
                                onClick={handleClose}
                                href={`/profile/${user.id}`}
                            >
                                <div className="h-9 w-9 object-cover">
                                    <Image
                                        className="rounded-full"
                                        width={40}
                                        height={40}
                                        src={user?.image || ''}
                                        alt={user?.name || ''}
                                    />
                                </div>
                                <span className="ml-2 text-lg">
                                    {user?.name}
                                </span>
                            </Link>
                        ) : (
                            <>
                                <Button
                                    className="mr-2 p-3"
                                    onClick={() =>
                                        setHistory((prev) =>
                                            prev.slice(0, prev.length - 1)
                                        )
                                    }
                                >
                                    <Icons.ArrowLeft className="text-base" />
                                </Button>
                                <span>{currentHistory.title}</span>
                            </>
                        )}
                    </div>

                    <ul className=" pt-3">
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
                                    className="relative flex h-[52px] w-full cursor-pointer items-center rounded-xl px-2 hover:bg-hover-2"
                                    key={item.title}
                                    onClick={handleClick}
                                >
                                    {item.icon && (
                                        <span className="mr-2 flex h-9 w-9 items-center justify-center rounded-full text-2xl">
                                            {item.icon()}
                                        </span>
                                    )}

                                    {item.title && (
                                        <h5 className="ml-2 text-base font-semibold">
                                            {item.title}
                                        </h5>
                                    )}

                                    {item.children && (
                                        <Icons.ArrowRight className="absolute right-2 text-2xl" />
                                    )}
                                </MenuItem>
                            );
                        })}

                        <Button
                            className="w-full"
                            variant={'secondary'}
                            onClick={handleLogout}
                        >
                            <Icons.LogOut className="mr-2 text-xl" />
                            Đăng xuất
                        </Button>
                    </ul>
                </div>
            </Popover>
        </>
    );
};

export default UserActionDropdown;
