'use realtime-server';
import { Comment, Post } from '@/models';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';
import { getAuthSession } from '../auth';

export const getCommentByCommentId = async ({
    commentId,
}: {
    commentId: string;
}) => {
    try {
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
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate('author', 'name avatar username')
            .populate('loves', 'name avatar username')
            .populate('post');

        return JSON.parse(JSON.stringify(comments));
    } catch (error: any) {
        logger({
            message: 'Erro get comment by post id' + error,
            type: 'error',
        });
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

export const getCommentsCountByPostId = async ({
    postId,
}: {
    postId: string;
}) => {
    try {
        await connectToDB();

        const count = await Comment.countDocuments({
            post: postId,
        });

        return count;
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
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const newComment = new Comment({
            text: content,
            author: session.user.id,
            post: postId,
            replyComment: replyTo,
        });

        await newComment.save();

        await Post.findByIdAndUpdate(postId, {
            $inc: { comments_count: 1 },
        });

        const comment = await getCommentByCommentId({
            commentId: newComment._id,
        });

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

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const comment = await Comment.findById(commentId);

        if (comment) {
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
        }

        await Post.findByIdAndUpdate(comment.post, {
            $inc: { comments_count: -1 },
        });

        await Comment.findByIdAndDelete(commentId);
    } catch (error) {
        throw new Error(`Error with delete comment: ${error}`);
    }
};
