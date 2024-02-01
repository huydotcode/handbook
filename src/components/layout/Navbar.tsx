'use client';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { BsFacebook } from 'react-icons/bs';
import { NavigationPages, NavNotification } from '../navbar';
import NavUser from '../navbar/NavUser';
import Searchbar from '../navbar/Searchbar';
import DarkmodeButton from '../ui/DarkmodeButton';
import { useState } from 'react';
import { Button } from '..';
import { AiOutlineMenu } from 'react-icons/ai';
import { useSession } from 'next-auth/react';

const Navbar = () => {
    const { data: session } = useSession();
    const path = usePathname();
    const [showPages, setShowPages] = useState<boolean>(false);

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 h-14 w-screen shadow-md dark:shadow-none md:px-2">
            <div className="relative flex h-full w-full items-center justify-between px-5 md:px-1">
                {/* Left */}
                <div className="flex min-w-min items-center ">
                    <Link className="flex items-center" href={'/'}>
                        <BsFacebook className="text-4xl text-blue-500" />
                    </Link>

                    <Searchbar />

                    <div className="ml-2 hidden md:block">
                        <Button onClick={() => setShowPages((prev) => !prev)}>
                            <AiOutlineMenu />
                        </Button>

                        {showPages && (
                            <NavigationPages
                                className="fixed left-0 top-14 flex h-[calc(100vh-56px)] min-w-[200px] max-w-[100vw] items-center bg-white shadow-xl"
                                direction="col"
                                itemClassName="w-full h-14 rounded-none mx-2"
                            />
                        )}
                    </div>
                </div>

                {/* Center */}
                <div className="mx-auto flex h-full max-w-[400px] flex-1 items-center justify-center md:hidden">
                    {path !== '/' && (
                        <NavigationPages
                            className="flex h-full w-full items-center"
                            direction="row"
                            itemClassName="h-full"
                            onlyIcon
                        />
                    )}
                </div>

                {/* Right */}
                <div className="flex h-full items-center">
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
