import Comment from '@/models/Comment';
import Post from '@/models/Post';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';

const url = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const fetchAllPostsId = async () => {
    logger('Fetch all posts');

    try {
        await connectToDB();
        const posts = await Post.find({}).sort({ createdAt: -1 });
        const allPostsId = posts.flatMap((post) => post._id.toString());

        if (allPostsId) {
            return allPostsId;
        }
    } catch (error: any) {
        throw new Error(error);
    }
};

export const fetchAllPostIdByUser = async (id: string) => {
    try {
        await connectToDB();
        const posts = await Post.find({
            'creator.id': id,
        }).sort({
            createdAt: -1,
        });
        const allPostsId = posts.flatMap((post) => post._id);
        return allPostsId;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const fetchPost = async (postId: string) => {
    try {
        await connectToDB();
        const post = await Post.findById(postId)
            .populate('creator', 'name image')
            .populate('loves', 'name image')
            .exec();

        return JSON.parse(JSON.stringify(post));
    } catch (error: any) {
        console.log(error);
    }
};

export const fetchCommentPost = async (postId: string) => {
    try {
        await connectToDB();
        const comments = await Comment.find({ postId: postId }).sort({
            createdAt: -1,
        });

        return JSON.parse(JSON.stringify(comments));
    } catch (error: any) {
        console.log(error);
    }
};
