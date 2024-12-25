'use client';
import { navLink } from '@/constants/navLink';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';
import { Tooltip } from '@mui/material';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <aside className="no-scrollbar fixed left-0 top-[56px] h-full min-w-[280px] max-w-[360px] overflow-scroll border-r-2 bg-white p-2 dark:border-none dark:bg-dark-secondary-1 xl:min-w-[200px] lg:min-w-0 md:hidden">
            {user && (
                <Link
                    href={`/profile/${user?.id}`}
                    className="flex items-center rounded-xl p-2 hover:bg-hover-1 dark:hover:bg-dark-hover-1 md:justify-center"
                >
                    <Image
                        className="rounded-full "
                        width={32}
                        height={32}
                        src={user?.image || ''}
                        alt={user?.name || ''}
                    />

                    <span className="ml-2 text-sm dark:text-dark-primary-1 lg:hidden">
                        {user?.name}
                    </span>
                </Link>
            )}

            <ul
                className={cn(
                    `top-14 z-50 flex w-full flex-col items-center justify-between overflow-hidden bg-white transition-all duration-1000 dark:bg-dark-secondary-1 md:hidden`
                )}
            >
                {navLink.map((link, index) => {
                    const path = usePathname();
                    const isActived =
                        path === link.path ||
                        (path.includes(link.path) && link.path !== '/');
                    const Icon = () => {
                        return link.icon;
                    };

                    if (link.role === 'admin' && session?.user.role !== 'admin')
                        return null;

                    return (
                        <Tooltip title={link.name} key={link.name}>
                            <li
                                key={index}
                                className={cn(
                                    `flex w-full cursor-pointer items-center rounded-xl p-2 hover:bg-hover-2 dark:hover:bg-dark-hover-1`
                                )}
                            >
                                <Link
                                    className={cn(
                                        'flex h-full w-full items-center justify-start dark:text-dark-primary-1',
                                        {
                                            'text-blue dark:text-blue':
                                                isActived,
                                        }
                                    )}
                                    href={link.path || '/'}
                                >
                                    <Icon />

                                    <span className="ml-2 text-xs lg:hidden">
                                        {link.name}
                                    </span>
                                </Link>
                            </li>
                        </Tooltip>
                    );
                })}
            </ul>
        </aside>
    );
};

export default Sidebar;
