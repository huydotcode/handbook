'use server';
import { Post } from '@/models';
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
        console.log('Error fetching posts:', error);
    }
};

export const fetchPostsCount = async () => {
    try {
        const postCount = await Post.countDocuments();

        return JSON.parse(JSON.stringify(postCount));
    } catch (error) {
        console.log('Error fetching posts count:', error);
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
        console.log('Error deleting post:', error);
    }
};
