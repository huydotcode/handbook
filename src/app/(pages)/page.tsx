import { FriendSection, Sidebar } from '@/components/layout';
import { NavigationPages } from '@/components/navbar';
import { IndexLayout } from '@/layouts';
import InfinityPostComponent from '../../components/post/InfinityPostComponent';

export default async function Home() {
    return (
        <>
            <IndexLayout
                Center={
                    <>
                        <div className="hidden w-full sm:block">
                            <NavigationPages
                                direction="row"
                                className="flex max-w-full items-center overflow-hidden rounded-xl bg-white shadow-xl dark:border-t dark:border-t-gray-700 dark:bg-dark-200"
                                itemClassName="w-full"
                            />
                        </div>

                        <InfinityPostComponent />
                    </>
                }
                Left={<Sidebar />}
                Right={<FriendSection show />}
            />
        </>
    );
}
