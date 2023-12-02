'use server';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import User from '@/models/User';
import connectToDB from '@/services/mongoose';
import { revalidatePath } from 'next/cache';

export const fetchNewFeedPost = async ({
    page = 1,
    pageSize = 5,
    pathname = '',
    userId = '',
    username = '',
}: {
    userId: string | undefined;
    username: string | undefined;
    page: number;
    pageSize: number;
    pathname: string;
}) => {
    let query = {} as any;

    if (userId || username) {
        let user = await User.findOne({
            $or: [{ _id: userId }, { username }],
        });

        query = user ? { creator: user._id } : {};
    }

    try {
        await connectToDB();
        const posts = await Post.find(query)
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ createdAt: -1 });

        for (const post of posts) {
            post.commentCount = await Comment.countDocuments({
                postId: post._id,
            });
        }

        await User.populate(posts, { path: 'creator', select: 'name image' });

        if (pathname !== '') {
            revalidatePath(pathname);
        }

        return JSON.parse(JSON.stringify(posts));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const fetchCommentPostId = async ({
    page,
    pageSize,
    path,
    postId,
}: {
    postId: string;
    page: number;
    pageSize: number;
    path: string;
}) => {
    try {
        const comments = await Comment.find({
            postId: postId,
            parentCommentId: null,
        })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(comments));
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    } finally {
        if (!!path) {
            revalidatePath(path);
        }
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
        await connectToDB();
        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ postId: postId });

        revalidatePath(path);
    } catch (error: any) {
        console.log('Error: ', error);
        throw new Error(error);
    }
};
