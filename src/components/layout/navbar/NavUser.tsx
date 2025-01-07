'use client';
import { SetStateAction, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import Link from 'next/link';
import { Icons } from '@/components/ui';

const NavUser = () => {
    const { data: session } = useSession();
    const [history, setHistory] = useState([{ data: [] as any }]);
    const currentHistory = history[history.length - 1] as any;

    const user = session?.user as ISessionUser;

    const handleLogout = async () => {
        await signOut();
    };

    const handleClose = () => {
        setHistory([{ data: [] }]);
    };

    return (
        <>
            <Popover>
                <PopoverTrigger className={'ml-2 flex items-center'}>
                    <Image
                        className="cursor-pointer rounded-full"
                        width={40}
                        height={40}
                        src={(session?.user && session?.user.image) || ''}
                        alt="Your profile picture"
                        referrerPolicy="no-referrer"
                    />
                </PopoverTrigger>
                <PopoverContent align="start">
                    <div className="relative flex flex-col">
                        <div className="flex w-full items-center">
                            {currentHistory == history[0] ? (
                                <Link
                                    className="flex w-full items-center rounded-xl p-2 shadow-md hover:bg-hover-2 dark:text-dark-primary-1 dark:hover:bg-dark-hover-1"
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
                                    <span className="ml-2">{user?.name}</span>
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
                            {currentHistory.data.map((item: any) => {
                                const handleClick = () => {
                                    if (item.action) {
                                        item.action();
                                    }
                                    if (item.children) {
                                        setHistory(
                                            (prev: SetStateAction<any>) => [
                                                ...prev,
                                                item.children,
                                            ]
                                        );
                                    }

                                    if (!item.children) {
                                        handleClose();
                                    }
                                };

                                return (
                                    <Button
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
                                    </Button>
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
                </PopoverContent>
            </Popover>
        </>
    );
};

export default NavUser;
