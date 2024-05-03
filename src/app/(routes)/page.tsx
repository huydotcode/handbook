import { FriendSection, Sidebar } from '@/components/layout';
import { InfinityPostComponent } from '@/components/post';
import { IndexLayout } from '@/layouts';

export default async function Home() {
    return (
        <>
            <div className="mt-2">
                <IndexLayout
                    Left={<Sidebar />}
                    Center={<InfinityPostComponent />}
                    Right={<FriendSection />}
                />
            </div>
        </>
    );
}
