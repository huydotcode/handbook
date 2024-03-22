'use server';
import { Comment, Post } from '@/models';
import connectToDB from '@/services/mongoose';
import { isValidObjectId } from 'mongoose';
import { getAuthSession } from '../auth';

/*
    * Comment Model: 
    text: string;
    author: Types.ObjectId;
    replyComment: Types.ObjectId;
    loves: Types.ObjectId[];
    post: Types.ObjectId;
    isDeleted: boolean;
*/

export const getComment = async ({
    commentId = null,
}: {
    commentId: string | null;
}) => {
    try {
        if (!commentId) return null;
        if (commentId && !isValidObjectId(commentId)) return null;

        await connectToDB();

        const comment = await Comment.findById(commentId)
            .populate('author', 'name avatar username')
            .populate('loves', 'name avatar username')
            .populate('post');

        if (!comment) {
            return null;
        }

        return JSON.parse(JSON.stringify(comment));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getCommentsByPostId = async ({
    page,
    pageSize,
    postId,
}: {
    postId: string;
    page: number;
    pageSize: number;
}) => {
    try {
        await connectToDB();

        const comments = await Comment.find({
            post: postId,
            replyComment: null,
        })
            .populate('author', 'name avatar username')
            .populate('loves', 'name avatar username')
            .populate('post')
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return JSON.parse(JSON.stringify(comments));
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
};

export const getReplyComments = async ({
    commentId,
    page,
    pageSize,
}: {
    commentId: string;
    page: number;
    pageSize: number;
}) => {
    if (!commentId) return;

    try {
        await connectToDB();

        const comments = await Comment.find({
            replyComment: commentId,
        })
            .populate('author', 'name avatar username')
            .populate('loves', 'name avatar username')
            .populate('post')
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(comments));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const sendComment = async ({
    content,
    replyTo,
    postId,
}: {
    content: string;
    replyTo: string | null;
    postId: string;
}) => {
    const session = await getAuthSession();
    if (!session) return;

    try {
        await connectToDB();

        const newComment = new Comment({
            text: content,
            author: session.user.id,
            post: postId,
            replyComment: replyTo,
        });

        await newComment.save();

        await Post.findByIdAndUpdate(postId, {
            $push: {
                comments: newComment._id,
            },
        });

        const comment = await getComment({ commentId: newComment._id });

        if (!comment) {
            return null;
        }
        return JSON.parse(JSON.stringify(comment));
    } catch (error) {
        throw new Error(`Error with send comment: ${error}`);
    }
};

export const deleteComment = async ({ commentId }: { commentId: string }) => {
    if (!commentId) return;

    try {
        await connectToDB();

        const comment = await Comment.findById(commentId);

        const replyCommentsLength = await Comment.count({
            parentId: commentId,
        });

        if (replyCommentsLength > 0) {
            await Comment.updateMany(
                {
                    replyComment: commentId,
                },
                {
                    $set: {
                        replyComment: comment.replyComment,
                    },
                }
            );
        }

        await Comment.findByIdAndDelete(commentId);
    } catch (error) {
        throw new Error(`Error with delete comment: ${error}`);
    }
};
