import { FriendSection, Sidebar } from '@/components/layout';
import { InfinityPostComponent } from '@/components/post';

export default async function Home() {
    return (
        <>
            <div>
                <Sidebar />

                <div className="mx-auto mt-2 w-[600px] md:w-full">
                    <InfinityPostComponent />
                </div>

                <FriendSection />
            </div>
        </>
    );
}
