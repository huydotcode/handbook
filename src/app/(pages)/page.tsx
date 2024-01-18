import { NewsFeedPost } from '@/components';
import { FriendSection, Sidebar } from '@/components/layout';
import { NavigationPages } from '@/components/navbar';
import { IndexLayout } from '@/layouts';

export default async function Home() {
    return (
        <>
            <IndexLayout
                Center={
                    <>
                        <div className="hidden w-full sm:block">
                            <NavigationPages
                                direction="row"
                                className="flex items-center shadow-xl bg-white max-w-full overflow-hidden rounded-xl dark:bg-dark-200 dark:border-t-gray-700 dark:border-t"
                                itemClassName="w-full"
                            />
                        </div>

                        <NewsFeedPost />
                    </>
                }
                Left={<Sidebar />}
                Right={<FriendSection />}
            />
        </>
    );
}
