import { Post } from '@/components/post';
import { getPostByPostId } from '@/lib/actions/post.action';
import { notFound } from 'next/navigation';
import React from 'react';

interface Props {
    params: Promise<{ postId: string }>;
}

const PostPage: React.FC<Props> = async ({ params }) => {
    const { postId } = await params;
    const post = await getPostByPostId({ postId });
    if (!post) notFound();

    return (
        <div className="mx-auto mt-[64px] w-[800px] max-w-screen">
            <Post data={post} />
        </div>
    );
};

export default PostPage;
