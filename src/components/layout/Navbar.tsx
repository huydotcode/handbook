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
        <nav className="fixed w-screen h-14 top-0 left-0 right-0 shadow-md z-50 dark:shadow-none md:px-2">
            <div className="relative flex items-center justify-between h-full w-full px-5 md:px-1">
                {/* Left */}
                <div className="flex items-center min-w-min">
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
                                className="fixed top-14 left-0 flex items-center min-w-[200px] max-w-[100vw] h-[calc(100vh-56px)] bg-white shadow-xl"
                                direction="col"
                                itemClassName="w-full h-14 rounded-none mx-2"
                            />
                        )}
                    </div>
                </div>

                {/* Center */}
                <div className="flex items-center justify-center flex-1 max-w-[400px] h-full mx-auto md:hidden">
                    {path !== '/' && (
                        <NavigationPages
                            className="flex items-center w-full h-full"
                            direction="row"
                            itemClassName="h-full"
                            onlyIcon
                        />
                    )}
                </div>

                {/* Right */}
                <div className="flex items-center h-full">
                    <div className="relative flex items-center mr-4">
                        <DarkmodeButton />
                    </div>
                    <div className="flex items-center justify-center h-full mr-2">
                        {session?.user && <NavNotification />}
                    </div>
                    <div className="flex items-center h-full">
                        <NavUser />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
