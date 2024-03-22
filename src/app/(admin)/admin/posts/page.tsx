import React from 'react';
import { fetchAllPosts } from '@/lib/actions/admin/post.action';
import { PostItem, RefreshButton } from '../_components';

interface Props {}

const PostsPage: React.FC<Props> = async ({}) => {
    const posts = (await fetchAllPosts({ page: 1, limit: 20 })) as IPost[];

    return (
        <div className="flex w-full flex-col p-4">
            <div className="flex items-center">
                <h5 className="text-2xl font-bold">
                    Quản lý bài viết: {posts.length}
                </h5>

                <RefreshButton />
            </div>
            <div className="mt-2 grid w-full grid-cols-3 gap-2 xl:grid-cols-2 md:grid-cols-1">
                {posts.map((post) => {
                    return <PostItem data={post} key={post._id} />;
                })}

                {posts.length === 0 && (
                    <div className="col-span-3 text-center text-xl font-semibold text-secondary-1 dark:text-dark-primary-1">
                        Không có bài viết nào
                    </div>
                )}
            </div>
        </div>
    );
};
export default PostsPage;
