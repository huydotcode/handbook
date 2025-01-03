'use client';
import { Post } from '@/components/post';
import { getPostByPostId } from '@/lib/actions/post.action';
import { getPostKey } from '@/lib/queryKey';
import { useQuery } from '@tanstack/react-query';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

interface Props {
    params: {
        postId: string;
    };
}

const PostPage: React.FC<Props> = ({ params: { postId } }) => {
    const { data: post } = useQuery<IPost>({
        queryKey: getPostKey(postId),
        queryFn: async () => {
            const post = await getPostByPostId({ postId });
            return post;
        },
    });

    if (!post) notFound();

    return (
        <div className="mx-auto mt-[64px] w-[800px] max-w-screen">
            <Post data={post} />
        </div>
    );
};

export default PostPage;
