'use client';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import DarkmodeButton from '../../ui/DarkmodeButton';
import Icons from '../../ui/Icons';
import NavUser from './NavUser';
import NavNotification from './notification/NavNotification';
import Searchbar from './Searchbar';
import { navLink } from '@/constants/navLink';
import { usePathname } from 'next/navigation';
import { Tooltip } from '@mui/material';

const Navbar = () => {
    const { data: session } = useSession();
    const [showPages, setShowPages] = useState<boolean>(false);
    const path = usePathname();
    const listNavRef = React.useRef<HTMLUListElement>(null);

    // Xử lý click ra ngoài để đóng menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                listNavRef.current &&
                !listNavRef.current.contains(event.target as Node)
            ) {
                setShowPages(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [listNavRef]);

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 h-14 w-screen shadow-md md:px-2">
            <div className="relative flex h-full w-full items-center justify-between px-5 md:px-1">
                <div className="flex w-1/4 items-center md:w-1/2">
                    <div className={'flex items-center justify-center'}>
                        <Link className="flex h-8 w-8 items-center" href={'/'}>
                            <Icons.Logo className="text-4xl text-primary-2" />
                        </Link>
                    </div>

                    <Searchbar />

                    <div className="ml-2 hidden md:block">
                        <Button
                            onClick={() => setShowPages((prev) => !prev)}
                            size={'medium'}
                        >
                            <Icons.Menu />
                        </Button>
                    </div>
                </div>

                <div className="mx-auto flex h-full w-1/2 max-w-[400px] flex-1 items-center justify-center md:w-0">
                    <ul
                        className={cn(
                            `top-14 flex h-full w-full items-center justify-between overflow-hidden bg-white dark:bg-dark-secondary-1 md:hidden md:transition-all md:duration-100`,
                            showPages &&
                                'md:fixed md:left-0 md:top-14 md:flex md:h-[calc(100vh-56px)] md:w-[200px] md:flex-col md:items-start md:justify-start'
                        )}
                        ref={listNavRef}
                    >
                        {navLink.map((link, index) => {
                            if (
                                link.role === 'admin' &&
                                session?.user.role !== 'admin'
                            )
                                return null;

                            const isActived =
                                path === link.path ||
                                (path.includes(link.path) && link.path !== '/');
                            const Icon = () => {
                                return link.icon;
                            };

                            return (
                                <Tooltip title={link.name}>
                                    <li
                                        key={index}
                                        className={cn(
                                            `flex w-full cursor-pointer items-center p-2 hover:bg-hover-2 dark:hover:bg-dark-hover-1 md:rounded-xl`,
                                            {
                                                'border-b-4 border-b-blue':
                                                    isActived,
                                            }
                                        )}
                                    >
                                        <Link
                                            className={cn(
                                                'flex h-full w-full items-center justify-center dark:text-dark-primary-1 md:justify-start',
                                                {
                                                    'text-blue dark:text-blue':
                                                        isActived,
                                                }
                                            )}
                                            href={link.path || '/'}
                                        >
                                            <Icon />

                                            <span className="ml-2 hidden text-xs md:block">
                                                {link.name}
                                            </span>
                                        </Link>
                                    </li>
                                </Tooltip>
                            );

                            // return (
                            //     <Items.Nav
                            //         link={link}
                            //         key={index}
                            //         onlyIcon={true}
                            //         index={index}
                            //         handleClose={() => setShowPages(false)}
                            //     />
                            // );
                        })}
                    </ul>
                </div>

                <div className="flex h-full w-1/4 items-center justify-end md:w-1/2">
                    <div className="relative mr-4 flex items-center">
                        <DarkmodeButton />
                    </div>
                    <div className="mr-2 flex h-full items-center justify-center">
                        {session?.user && <NavNotification />}
                    </div>
                    <div className="flex h-full items-center">
                        <NavUser />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
