'use client';
import { navLink } from '@/constants/navLink';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Items } from '../shared';

const Sidebar = () => {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <aside className="fixed left-0 top-[72px] h-[calc(100vh-72px)] w-[20%] border-r-2 transition-all duration-300 dark:border-none lg:w-[10%] md:hidden">
            <div className="no-scrollbar w-full overflow-scroll pr-2">
                <div className="p-2">
                    {user && (
                        <Link
                            href={`/profile/${user?.id}`}
                            className="flex items-center rounded-xl p-2 hover:bg-hover-1 dark:hover:bg-dark-hover-1 md:justify-center"
                        >
                            <Image
                                className="rounded-full "
                                width={32}
                                height={32}
                                src={user?.image || ''}
                                alt={user?.name || ''}
                            />

                            <span className="ml-2 text-sm dark:text-dark-primary-1 lg:hidden">
                                {user?.name}
                            </span>
                        </Link>
                    )}

                    <div>
                        {navLink.map((link, index) => {
                            return (
                                <Items.Nav
                                    key={index}
                                    className="border-none hover:bg-hover-1"
                                    index={index}
                                    link={link}
                                    direction="col"
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
