'use client';
import Link from 'next/link';

import { useSession } from 'next-auth/react';
import { BsFacebook } from 'react-icons/bs';
import BackButton from '../navbar/BackButton';
import NavUser from '../navbar/NavUser';
import Notification from '../navbar/Notification';
import Searchbar from '../navbar/Searchbar';
import DarkmodeButton from '../ui/DarkmodeButton';

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <nav className="fixed w-screen h-14 top-0 left-0 right-0 shadow-md z-50 dark:shadow-none md:px-2">
            <div className="relative flex items-center justify-between h-full w-full px-5 md:px-1">
                {/* Left */}
                <div className="flex items-center min-w-min">
                    {/* <BackButton /> */}

                    <Link className="flex items-center" href={'/'}>
                        <BsFacebook className="text-4xl text-blue-500" />
                    </Link>

                    <Searchbar />
                </div>

                {/* Center */}
                {/* <div className="flex-1 max-w-[600px] h-full m-[0 auto]"></div> */}

                {/* Right */}
                <div className="flex items-center h-full">
                    <div className="relative flex items-center mr-4">
                        <DarkmodeButton />
                    </div>
                    <div className="flex items-center justify-center h-full mr-2">
                        {/* {session?.user && <Notification />} */}
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
