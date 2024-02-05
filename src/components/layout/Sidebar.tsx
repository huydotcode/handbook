import { getAuthSession } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import NavigationPages from './navbar/NavigationPages';

const Sidebar = async () => {
    const session = await getAuthSession();
    const user = session?.user;

    return (
        <aside className="fixed left-0 top-[72px] h-[calc(100vh-72px)] transition-all duration-300 md:hidden">
            <div className="no-scrollbar w-full overflow-scroll rounded-r-xl border-[1px] bg-white pr-2 shadow-md dark:border-none dark:bg-dark-200 dark:shadow-none">
                <div className="p-2">
                    {user && (
                        <Link
                            href={`/profile/${user?.id}`}
                            className="flex items-center rounded-xl border-b p-2 hover:bg-light-100 dark:border-none dark:hover:bg-dark-500 md:justify-center"
                        >
                            <Image
                                className="rounded-full "
                                width={32}
                                height={32}
                                src={user?.image || ''}
                                alt={user?.name || ''}
                            />

                            <span className="ml-2 text-sm dark:text-primary lg:hidden">
                                {user?.name}
                            </span>
                        </Link>
                    )}

                    <div>
                        <NavigationPages />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
