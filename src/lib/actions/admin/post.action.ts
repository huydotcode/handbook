'use server';
import { Post } from '@/models';
import logger from '@/utils/logger';
import { revalidatePath } from 'next/cache';

export const fetchAllPosts = async ({
    limit,
    page,
}: {
    page: number;
    limit: number;
}) => {
    try {
        const posts = await Post.find()
            .populate('creator', '_id name avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        logger({
            message: 'Error fetch all posts' + error,
            type: 'error',
        });
    }
};

export const fetchPostsCount = async () => {
    try {
        const postCount = await Post.countDocuments();

        return JSON.parse(JSON.stringify(postCount));
    } catch (error) {
        logger({
            message: 'Error fetch posts count',
            type: 'error',
        });
    }
};

export const deletePost = async ({
    postId,
    path,
}: {
    postId: string;
    path: string;
}) => {
    try {
        await Post.findByIdAndDelete(postId);

        revalidatePath(path);
    } catch (error) {
        logger({
            message: 'Error delete post' + error,
            type: 'error',
        });
    }
};
