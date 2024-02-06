import { FriendSection, Sidebar } from '@/components/layout';
import { InfinityPostComponent } from '@/components/post';
import { IndexLayout } from '@/layouts';

export default async function Home() {
    return (
        <>
            <IndexLayout
                Center={<InfinityPostComponent />}
                Left={<Sidebar />}
                Right={<FriendSection show />}
            />
        </>
    );
}
