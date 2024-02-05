import { FriendSection, Sidebar } from '@/components/layout';
import { NavigationPages } from '@/components/navbar';
import { IndexLayout } from '@/layouts';
import InfinityPostComponent from '../../components/post/InfinityPostComponent';

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
