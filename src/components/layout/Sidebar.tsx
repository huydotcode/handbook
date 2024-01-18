import { getAuthSession } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import NavigationPages from '../navbar/NavigationPages';

const Sidebar = async () => {
    const session = await getAuthSession();
    const user = session?.user;

    return (
        <div className="mt-4 mr-4 w-full overflow-scroll no-scrollbar rounded-r-xl border-[1px] pr-2 bg-white shadow-md dark:bg-dark-200 dark:shadow-none dark:border-none">
            <div className="p-2">
                {user && (
                    <Link
                        href={`/profile/${user?.id}`}
                        className="flex items-center hover:bg-light-100 p-2 rounded-xl border-b md:justify-center dark:border-none dark:hover:bg-dark-500"
                    >
                        <Image
                            className="rounded-full "
                            width={32}
                            height={32}
                            src={user?.image || ''}
                            alt={user?.name || ''}
                        />

                        <span className="ml-2 lg:hidden text-sm dark:text-primary">
                            {user?.name}
                        </span>
                    </Link>
                )}

                <div>
                    <NavigationPages />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
