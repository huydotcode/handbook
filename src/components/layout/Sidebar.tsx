'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import NavigationPages from '../navbar/NavigationPages';

interface User {
    id: string;
    name: string;
    image: string;
    email: string;
}

const Sidebar = () => {
    const { data: session } = useSession();
    const user = session?.user as User;

    return (
        <div className="mt-4 mr-4 rounded-r-xl border-[1px] pr-2 bg-white shadow-md dark:bg-dark-200 dark:shadow-none dark:border-none">
            <div className="p-2">
                {user && (
                    <Link
                        href={'/'}
                        className="flex items-center hover:bg-light-100 p-2 rounded-xl border-b md:justify-center dark:border-none dark:hover:bg-dark-500"
                    >
                        <Image
                            className="rounded-full "
                            width={32}
                            height={32}
                            src={user?.image || ''}
                            alt={user?.name || ''}
                        />

                        <span className="ml-2 md:hidden dark:text-primary">
                            {user?.name}
                        </span>
                    </Link>
                )}

                <div className="block">
                    <NavigationPages />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
