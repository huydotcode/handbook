'use server';
import { Post } from '@/models';

export const fetchPostsCount = async () => {
    try {
        const postCount = await Post.countDocuments();

        return postCount;
    } catch (error) {
        console.log('Error fetching posts count:', error);
    }
};
