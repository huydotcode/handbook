'use server';
import { Comment, Post } from '@/models';
import { getAuthSession } from '../auth';
import connectToDB from '@/services/mongoose';

/*
    * POST MODEL
    option: string;
    text: string;
    images: Types.ObjectId[];
    author: Types.ObjectId;
    loves: Types.ObjectId[];
    shares: Types.ObjectId[];
    group: Types.ObjectId;
    comments: Types.ObjectId[];
*/

const POPULATE_USER = 'name username avatar';
const POPULATE_GROUP = 'name avatar';

export const getPost = async ({ postId }: { postId: string }) => {
    try {
        await connectToDB();

        const post = await Post.findById(postId)
            .populate('author', POPULATE_USER)
            .populate('group', POPULATE_GROUP)
            .populate('images')
            .populate('loves', POPULATE_USER)
            .populate('shares', POPULATE_USER)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: POPULATE_USER,
                },
            });

        return JSON.parse(JSON.stringify(post));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const createPost = async ({
    content,
    images,
    option,
    groupId = null,
}: {
    content: string;
    images: any[];
    option: string;
    groupId?: string | null;
}) => {
    const session = await getAuthSession();
    if (!session) return;

    try {
        await connectToDB();

        const newPost = new Post({
            text: content,
            images,
            option,
            author: session.user.id,
            group: groupId,
        });
        await newPost.save();

        const post = await getPost({ postId: newPost._id });

        return JSON.parse(JSON.stringify(post));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const editPost = async ({
    content,
    images,
    option,
    postId,
}: {
    content: string;
    images: string[];
    option: string;
    postId: string;
}) => {
    try {
        const session = await getAuthSession();
        if (!session) return;

        await Post.findByIdAndUpdate(postId, {
            text: content,
            images,
            option,
        });

        const post = await getPost({ postId });

        return JSON.parse(JSON.stringify(post));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const sendReaction = async ({ postId }: { postId: string }) => {
    try {
        await connectToDB();
        const session = await getAuthSession();

        if (!session) {
            throw new Error('Đã có lỗi xảy ra. Vui lòng thử lại!');
        }

        const post = await Post.findById(postId);

        const userId = session.user.id;

        if (!post || !userId) {
            throw new Error(`Post or user not found`);
        }

        const isReacted = post.loves.find((r: any) => r.toString() === userId);

        if (isReacted) {
            post.loves = post.loves.filter((r: any) => r.toString() !== userId);
        } else {
            post.loves.push(userId);
        }

        await post.save();
    } catch (error: any) {
        throw new Error(error);
    }
};

export const deletePost = async ({ postId }: { postId: string }) => {
    try {
        await connectToDB();
        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ postId: postId });
    } catch (error: any) {
        throw new Error(error);
    }
};
