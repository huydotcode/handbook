'use server';
import { POPULATE_GROUP, POPULATE_USER } from '@/lib/populate';
import { Post } from '@/models';
import logger from '@/utils/logger';
import { revalidatePath } from 'next/cache';

export const fetchAllPosts = async () => {
    console.log('[LIB-ACTIONS] fetchAllPosts');
    try {
        const posts = await Post.find()
            .populate('author', POPULATE_USER)
            .populate('group', POPULATE_GROUP)
            .populate('media')
            .sort({ createdAt: -1 });

        console.log(
            '[LIB-ACTIONS] fetchAllPosts',
            posts.length,
            'posts fetched'
        );

        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        logger({
            message: 'Error fetch all posts' + error,
            type: 'error',
        });
    }
};

export const fetchPostsCount = async () => {
    console.log('[LIB-ACTIONS] fetchPostsCount');
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
    console.log('[LIB-ACTIONS] deletePost');
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
