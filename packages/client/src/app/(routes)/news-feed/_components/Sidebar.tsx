'use client';
import React from 'react';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import SidebarCollapse from '@/components/layout/SidebarCollapse';

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
        <SidebarCollapse>
            <div className="px-x w-full py-1">
                <h1 className="text-2xl font-bold">News Feed</h1>

                <div className="flex w-full flex-col gap-1">
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
                                    'w-full justify-start rounded-xl py-6 text-base font-normal',
                                    {
                                        'bg-primary-1 text-primary-2 dark:bg-dark-primary-1':
                                            isActive,
                                    }
                                )}
                                href={item.link}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">
                                        <Icon />
                                    </span>
                                    <span className="ml-2 text-sm">
                                        {item.name}
                                    </span>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </SidebarCollapse>
    );
};

export default Sidebar;
