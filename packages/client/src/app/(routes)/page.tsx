import { FriendSection, Sidebar } from '@/components/layout';
import { InfinityPostComponent } from '@/components/post';
import { getAuthSession } from '@/lib/auth';

const HomePage = async () => {
    const session = await getAuthSession();
    if (!session) return null;

    return (
        <div className="relative top-[56px] mx-auto min-h-[calc(100vh-56px)] w-[1200px] max-w-screen md:w-screen">
            <Sidebar />

            <div className="mx-auto mt-2 w-[600px] xl:w-[550px] md:w-full">
                <InfinityPostComponent type="new-feed" />
            </div>

            <FriendSection session={session} />
        </div>
    );
};

export default HomePage;
