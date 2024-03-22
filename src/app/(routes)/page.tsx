import { FriendSection, Sidebar } from '@/components/layout';
import { InfinityPostComponent } from '@/components/post';

export default async function Home() {
    return (
        <>
            <div className="mt-2">
                <Sidebar />
                <InfinityPostComponent />
                <FriendSection />
            </div>
        </>
    );
}
