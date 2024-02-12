import { FriendSection, Sidebar } from '@/components/layout';
import { SkeletonPost } from '@/components/post';
import { IndexLayout } from '@/layouts';
import dynamic from 'next/dynamic';

const InfinityPostComponent = dynamic(
    () => import('@/components/post/InfinityPostComponent')
);

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
