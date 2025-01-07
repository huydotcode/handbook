'use client';
import { navAdmin } from '@/constants/navLink';
import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const Sidebar: React.FC = () => {
    const path = usePathname();

    return (
        <aside className="fixed left-0 top-[56px] h-screen w-[80px] bg-secondary-1">
            {navAdmin.map((item, index) => {
                const isActived =
                    path === item.path ||
                    (path.includes(item.path) && item.path !== '/');
                const Icon = () => {
                    return item.icon;
                };

                return (
                    <TooltipProvider key={item.name}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <li
                                    key={index}
                                    className={cn(
                                        `flex flex-1 cursor-pointer items-center p-2 hover:bg-hover-2 dark:hover:bg-dark-hover-1 md:rounded-xl`,
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
                                        href={item.path || '/'}
                                    >
                                        <Icon />
                                    </Link>
                                </li>
                            </TooltipTrigger>
                            <TooltipContent asChild>
                                <span>{item.name}</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            })}
        </aside>
    );
};

export default Sidebar;
