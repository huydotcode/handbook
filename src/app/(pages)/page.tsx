import { NewsFeedPost } from '@/components';
import { Sidebar } from '@/components/layout';

export default async function Home() {
    return (
        <>
            <aside className="min-w-[280px] max-w-[360px] sm:hidden lg:min-w-[100px]">
                <Sidebar />
            </aside>

            <div className="min-w-[600px] max-w-[50vw] mx-auto sm:w-screen sm:m-0 sm:max-w-none sm:min-w-0 md:min-w-[500px] lg:min-w-[600px]">
                <NewsFeedPost />
            </div>

            <aside className="min-w-[280px] max-w-[360px] lg:hidden"></aside>
        </>
    );
}
