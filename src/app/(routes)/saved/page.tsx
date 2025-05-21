import { FriendSection, Sidebar } from '@/components/layout';
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
        <div className="relative top-[56px] mx-auto min-h-[calc(100vh-56px)] w-[1200px] max-w-screen md:w-screen">
            <Sidebar />

            <div className="mx-auto mt-2 w-[600px] xl:w-[550px] md:w-full">
                <h1 className="text-2xl font-bold">Đã lưu</h1>

                <div className="mt-4">
                    {postsSaved.posts.reverse().map((post) => (
                        <Post key={post._id} data={post} isSaved={true} />
                    ))}

                    {postsSaved.posts.length === 0 && (
                        <p className="text-center">Không có bài viết nào</p>
                    )}
                </div>
            </div>

            {session && <FriendSection session={session} />}
        </div>
    );
}
