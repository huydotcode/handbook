'use client';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui';
import NavigationPages from './NavigationPages';
import NavUser from './NavUser';
import Searchbar from './Searchbar';
import DarkmodeButton from '../../ui/DarkmodeButton';
import Icons from '../../ui/Icons';
import NavNotification from './notification/NavNotification';

const Navbar = () => {
    const { data: session } = useSession();
    const [showPages, setShowPages] = useState<boolean>(false);

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

                        <NavigationPages
                            className={cn(
                                'fixed left-0 top-14 z-50 flex h-[calc(100vh-56px)] items-center overflow-hidden  shadow-xl transition-all duration-1000',
                                showPages && 'md:w-fit',
                                !showPages && 'md:w-0'
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
