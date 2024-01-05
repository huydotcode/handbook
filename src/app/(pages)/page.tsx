import { NewsFeedPost } from '@/components';
import { FriendSection, Sidebar } from '@/components/layout';
import { NavigationPages } from '@/components/navbar';
import ChatBox from '@/components/pages/Messages/ChatBox';
import { getAuthSession } from '@/lib/auth';

export default async function Home() {
    const session = await getAuthSession();

    return (
        <>
            <aside className="fixed top-[72px] left-0 min-w-[280px] max-w-[360px] sm:hidden lg:min-w-0 transition-all duration-300">
                <Sidebar />
            </aside>

            <div className="min-w-[500px] max-w-[50vw] mx-auto sm:w-screen sm:m-0 sm:max-w-none sm:min-w-0 md:min-w-[400px] lg:min-w-[400px]">
                <div className="hidden sm:block">
                    <NavigationPages
                        direction="row"
                        className="flex items-center shadow-xl bg-white w-screen overflow-hidden dark:bg-dark-200 dark:border-t-gray-700 dark:border-t"
                        itemClassName="w-full"
                    />
                </div>

                <NewsFeedPost />
            </div>

            <aside className="fixed top-[72px] right-0 w-[280px] max-w-[360px] h-[calc(100vh-72px)] lg:hidden flex justify-end">
                <div className="relative right-0 w-[80%] h-full">
                    <FriendSection />
                    <div className="absolute bottom-0 right-[100%]">
                        <ChatBox isPopup />
                    </div>
                </div>
            </aside>
        </>
    );
}
