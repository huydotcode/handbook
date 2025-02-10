import { Post } from '@/components/post';
import { getSavedPosts } from '@/lib/actions/post.action';
import { getAuthSession } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function SavedPage() {
    const session = await getAuthSession();
    if (!session) notFound();

    const postsSaved = (await getSavedPosts({
        userId: session.user.id,
    })) as ISavedPost;

    return (
        <div className="mx-auto mt-[64px] w-[800px] max-w-screen">
            <h1 className="text-2xl font-bold">Đã lưu</h1>

            <div className="mt-4">
                {postsSaved.posts.map((post) => (
                    <Post key={post._id} data={post} />
                ))}
            </div>
        </div>
    );
}
