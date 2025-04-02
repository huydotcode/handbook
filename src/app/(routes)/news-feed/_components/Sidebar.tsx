'use client';
import React from 'react';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const sidebarItems = [
    {
        name: 'Tất cả',
        icon: <Icons.Home className={'h-8 w-8'} />,
        link: '/news-feed',
    },
    {
        name: 'Bạn bè',
        icon: <Icons.Users className={'h-8 w-8'} />,
        link: '/news-feed?filter=friend',
    },
    {
        name: 'Nhóm',
        icon: <Icons.Group className={'h-8 w-8'} />,
        link: '/news-feed?filter=group',
    },
];

const Sidebar = () => {
    const path = usePathname();
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter');

    return (
        <aside className="no-scrollbar fixed left-0 top-2 z-10 h-[calc(100vh-64px)] w-[360px] max-w-[360px] overflow-scroll border-r-2 bg-white p-2 dark:border-none dark:bg-dark-secondary-1 lg:max-w-[80px]">
            <div className="px-x py-1 lg:px-1">
                <h1 className="text-2xl font-bold lg:hidden">News Feed</h1>

                <div className="flex flex-col gap-1">
                    {sidebarItems.map((item) => {
                        const Icon = () => {
                            return item.icon;
                        };

                        const isActive = filter
                            ? path === item.link.split('?')[0] &&
                              filter === item.link.split('=')[1]
                            : path === item.link;

                        return (
                            <Button
                                key={item.name}
                                variant="ghost"
                                className={cn(
                                    'w-full justify-start rounded-xl py-6 text-base font-normal lg:justify-center lg:p-0 lg:text-xl',
                                    {
                                        'bg-primary-1 text-primary-2': isActive,
                                    }
                                )}
                                href={item.link}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">
                                        <Icon />
                                    </span>
                                    <span className="ml-2 text-sm lg:hidden">
                                        {item.name}
                                    </span>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
