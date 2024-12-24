'use client';
import { Post } from '@/components/post';
import { PostService } from '@/lib/services';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface Props {
    params: {
        postId: string;
    };
}

const PostPage: React.FC<Props> = ({ params: { postId } }) => {
    const { data: post } = useQuery<IPost>({
        queryKey: ['post', postId],
        queryFn: async () => {
            const post = await PostService.getPostByPostId({ postId });
            return post;
        },
    });

    const setPosts = () => {};

    if (!post) return null;

    return (
        <div className="mx-auto mt-[64px] w-[800px] max-w-screen">
            <Post data={post} setPosts={setPosts} />
        </div>
    );
};

export default PostPage;
