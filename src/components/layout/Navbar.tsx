'use client';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '..';
import { NavigationPages, NavNotification } from '../navbar';
import NavUser from '../navbar/NavUser';
import Searchbar from '../navbar/Searchbar';
import DarkmodeButton from '../ui/DarkmodeButton';
import Icons from '../ui/Icons';

const Navbar = () => {
    const { data: session } = useSession();
    const [showPages, setShowPages] = useState<boolean>(false);

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 h-14 w-screen shadow-md dark:shadow-none md:px-2">
            <div className="relative flex h-full w-full items-center justify-between px-5 md:px-1">
                <div className="flex w-1/4 items-center md:w-1/2">
                    <Link className="flex items-center" href={'/'}>
                        <Icons.Logo className="text-4xl text-blue-500" />
                    </Link>
                    <Searchbar />

                    <div className="ml-2 hidden md:block">
                        <Button onClick={() => setShowPages((prev) => !prev)}>
                            <Icons.Menu />
                        </Button>

                        <NavigationPages
                            className={cn(
                                'fixed left-0 top-14 z-50 hidden h-[calc(100vh-56px)] items-center bg-white shadow-xl transition-all duration-1000 md:flex md:w-0 ',
                                showPages && 'md:w-fit'
                            )}
                            direction="col"
                            itemClassName="w-full h-14 rounded-none mx-2"
                            handleClose={() => setShowPages(false)}
                            onlyIcon={false}
                        />
                    </div>
                </div>

                <div className="mx-auto flex h-full w-1/2 max-w-[400px] flex-1 items-center justify-center md:hidden">
                    <NavigationPages
                        className="flex h-full w-full items-center"
                        direction="row"
                        itemClassName="h-full"
                        onlyIcon
                    />
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
