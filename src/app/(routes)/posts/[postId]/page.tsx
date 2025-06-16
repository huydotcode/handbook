'use client';
import { Post } from '@/components/post';
import { Loading } from '@/components/ui';
import { API_ROUTES } from '@/config/api';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react';
interface Props {
    params: Promise<{ postId: string }>;
}

const PostPage: React.FC<Props> = ({ params }) => {
    const { postId } = use(params);
    const { data: post, isLoading } = useQuery<IPost>({
        queryKey: queryKey.posts.id(postId || ''),
        queryFn: async () => {
            if (!postId) return null;

            try {
                const res = await axiosInstance.get(
                    API_ROUTES.POSTS.ID(postId)
                );
                return res.data;
            } catch (error) {
                console.log(error);
                return null;
            }
        },
        enabled: !!postId,
    });

    if (isLoading) {
        return <Loading fullScreen />;
    }

    if (!post) {
        return (
            <div className="mx-auto mt-[64px] w-[800px] max-w-screen">
                <h1>Bài viết không tồn tại</h1>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-[64px] w-[800px] max-w-screen">
            <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
                Bài viết của {post?.author.name}
            </h1>
            <Post data={post} />
        </div>
    );
};

export default PostPage;
