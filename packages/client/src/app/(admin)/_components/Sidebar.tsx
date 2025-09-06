'use client';
import { Button } from '@/components/ui/Button';
import { navAdmin } from '@/constants/navLink';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const Sidebar: React.FC = () => {
    const { data: session } = useSession();
    const path = usePathname();
    const router = useRouter();

    const [openChildren, setOpenChildren] = React.useState<string[]>([]);

    return (
        <>
            <aside className="fixed left-0 top-[56px] flex h-screen w-[300px] flex-col border-r bg-secondary-1 p-2 dark:bg-dark-secondary-1 xl:w-[80px]">
                <div className="flex w-full items-center justify-center border-b p-4 xl:hidden">
                    <h1>Xin chào, {session?.user.name || 'Admin'}</h1>
                </div>

                <div className="mt-2 flex flex-col">
                    {navAdmin.map((item, index) => {
                        const isActived =
                            path === item.path ||
                            (path.includes(item.path) &&
                                item.path !== '/admin');
                        const Icon = () => {
                            return item.icon;
                        };

                        return (
                            <div
                                className={cn('flex w-full flex-col')}
                                key={item.name}
                            >
                                <Button
                                    key={index}
                                    variant="ghost"
                                    className={cn(
                                        'justify-start rounded-md px-4 py-6',
                                        isActived &&
                                            'dark:text-dark-primary-2 bg-primary-1 text-primary-2 hover:bg-secondary-2 hover:text-primary-2 dark:bg-dark-primary-1'
                                    )}
                                    onClick={() => {
                                        if (item.path) {
                                            router.push(item.path);
                                        }

                                        if (item.children) {
                                            if (
                                                openChildren.includes(item.name)
                                            ) {
                                                setOpenChildren((prev) =>
                                                    prev.filter(
                                                        (name) =>
                                                            name !== item.name
                                                    )
                                                );
                                            } else {
                                                setOpenChildren((prev) => [
                                                    ...prev,
                                                    item.name,
                                                ]);
                                            }
                                        } else {
                                            setOpenChildren([]);
                                        }
                                    }}
                                >
                                    <Icon />
                                    <span className="text-sm xl:hidden">
                                        {item.name}
                                    </span>
                                </Button>

                                {item.children && (
                                    <div
                                        className={cn(
                                            'flex w-full flex-col transition-all duration-300 ease-in-out',
                                            openChildren.includes(item.name)
                                                ? 'h-auto'
                                                : 'h-0 overflow-hidden'
                                        )}
                                    >
                                        {item.children.map((child) => {
                                            const isChildActived =
                                                path === child.path ||
                                                (path.includes(child.path) &&
                                                    child.path !==
                                                        '/admin/market');
                                            return (
                                                <Button
                                                    key={child.name}
                                                    variant="event"
                                                    className={cn(
                                                        'w-full justify-start px-8 py-2 text-sm transition-all duration-300 ease-in-out',
                                                        isChildActived &&
                                                            'dark:text-dark-primary-2 bg-primary-1 text-primary-2 hover:bg-secondary-2 hover:text-primary-2 dark:bg-dark-primary-1'
                                                    )}
                                                    onClick={() =>
                                                        router.push(child.path)
                                                    }
                                                >
                                                    <span className="text-md xl:hidden">
                                                        {child.name}
                                                    </span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </aside>
            {/* <aside className="fixed left-0 top-[56px] h-screen bg-secondary-1"></aside> */}
        </>
    );
};

export default Sidebar;
