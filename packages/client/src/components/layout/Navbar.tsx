'use client';
import { Button } from '@/components/ui/Button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { navbarLink, navLink } from '@/constants/navLink';
import { UserRole } from '@/enums/UserRole';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DarkmodeButton from '../ui/DarkmodeButton';
import Icons from '../ui/Icons';
import NavbarNotification from './NavbarNotification';
import NavbarSearch from './NavbarSearch';
import NavbarUser from './NavbarUser';

const Navbar = () => {
    const { data: session } = useSession();
    const [showPages, setShowPages] = useState<boolean>(false);
    const path = usePathname();
    const listNavRef = React.useRef<HTMLUListElement>(null);
    const menuButtonRef = React.useRef<HTMLButtonElement>(null);

    // Xử lý click ra ngoài để đóng menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                listNavRef.current &&
                !listNavRef.current.contains(event.target as Node) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target as Node)
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

                    <NavbarSearch />

                    <div className="ml-2 hidden md:block">
                        <Button
                            onClick={() => setShowPages((prev) => !prev)}
                            size={'md'}
                            variant={'ghost'}
                            ref={menuButtonRef}
                        >
                            <Icons.Menu />
                        </Button>
                    </div>
                </div>
                <div className="mx-auto flex h-full w-1/2 max-w-[400px] flex-1 items-center justify-center md:hidden">
                    <ul
                        className={
                            'top-14 flex h-full w-full items-center justify-between overflow-hidden bg-white dark:bg-dark-secondary-1'
                        }
                        ref={listNavRef}
                    >
                        {navbarLink.map((link) => {
                            if (
                                link.role === UserRole.ADMIN &&
                                session?.user.role !== UserRole.ADMIN
                            )
                                return null;

                            const isActived =
                                path === link.path ||
                                (path.includes(link.path) &&
                                    link.path !== '/' &&
                                    !path.includes('/admin'));
                            const Icon = () => {
                                return link.icon;
                            };

                            return (
                                <TooltipProvider key={link.name}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <li
                                                className={cn(
                                                    `flex h-full w-full cursor-pointer items-center p-2 hover:bg-hover-2 dark:hover:bg-dark-hover-1 md:rounded-xl`,
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
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            {link.name}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                    </ul>
                </div>

                {showPages && (
                    <ul
                        className={
                            'fixed left-0 top-14 hidden w-[200px] flex-col items-center justify-between overflow-hidden rounded-b-xl bg-white p-2 shadow-xl dark:bg-dark-secondary-1 md:flex'
                        }
                        ref={listNavRef}
                    >
                        {navLink.map((link, index) => {
                            if (
                                link.role === UserRole.ADMIN &&
                                session?.user.role !== UserRole.ADMIN
                            )
                                return null;

                            const isActived =
                                path === link.path ||
                                (path.includes(link.path) &&
                                    link.path !== '/' &&
                                    !path.includes('/admin'));
                            const Icon = () => {
                                return link.icon;
                            };

                            return (
                                <TooltipProvider key={link.name}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <li
                                                key={index}
                                                className={cn(
                                                    `flex w-full cursor-pointer items-center p-2 hover:bg-hover-2 dark:hover:bg-dark-hover-1`,
                                                    {
                                                        'border-b-4 border-b-blue':
                                                            isActived,
                                                    }
                                                )}
                                            >
                                                <Link
                                                    className={cn(
                                                        'flex w-full items-center justify-center dark:text-dark-primary-1 md:justify-start',
                                                        {
                                                            'text-blue dark:text-blue':
                                                                isActived,
                                                        }
                                                    )}
                                                    href={link.path || '/'}
                                                    onClick={() =>
                                                        setShowPages(false)
                                                    }
                                                >
                                                    <Icon />

                                                    <span className="ml-2 hidden text-xs md:block">
                                                        {link.name}
                                                    </span>
                                                </Link>
                                            </li>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {link.name}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                    </ul>
                )}
                <div className="flex h-full w-1/4 items-center justify-end md:w-1/2">
                    <div className="mr-2 flex h-full items-center justify-center">
                        <NavbarNotification />
                    </div>
                    <div className="flex h-full items-center">
                        <NavbarUser />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
