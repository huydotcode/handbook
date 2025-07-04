'use server';
import { Comment, Post } from '@/models';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';
import { getAuthSession } from '../auth';

export const getCommentByCommentId = async ({
    commentId,
}: {
    commentId: string;
}) => {
    console.log('[LIB-ACTIONS] getCommentByCommentId');
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

export const sendComment = async ({
    content,
    replyTo,
    postId,
}: {
    content: string;
    replyTo: string | null;
    postId: string;
}) => {
    console.log('[LIB-ACTIONS] sendComment');
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        // Tạo bình luận mới
        const newComment = new Comment({
            text: content,
            author: session.user.id,
            post: postId,
            replyComment: replyTo,
        });

        await newComment.save();

        // Cập nhật số lượng bình luận của bài viết
        await Post.findByIdAndUpdate(postId, {
            $inc: { commentsCount: 1 },
        });

        // Lấy thông tin bình luận mới
        const comment = await getCommentByCommentId({
            commentId: newComment._id,
        });

        if (replyTo) {
            // Cập nhật trạng thái hasReplies
            await Comment.findByIdAndUpdate(replyTo, { hasReplies: true });
        }

        if (!comment) {
            throw new Error('Không tìm thấy bình luận');
        }

        return JSON.parse(JSON.stringify(comment));
    } catch (error) {
        console.log('error', error);
        throw new Error(`Error with send comment: ${error}`);
    }
};

export const deleteComment = async ({ commentId }: { commentId: string }) => {
    console.log('[LIB-ACTIONS] deleteComment');
    if (!commentId) return;

    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new Error('Bình luận không tồn tại');
        }

        await Post.findByIdAndUpdate(comment.post, {
            $inc: { commentsCount: -1 },
        });

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
            } else {
                await Comment.findByIdAndUpdate(comment.replyComment, {
                    hasReplies: false,
                });
            }
        }

        await Comment.findByIdAndDelete(commentId);
    } catch (error) {
        throw new Error(`Error with delete comment: ${error}`);
    }
};

export const loveComment = async ({ commentId }: { commentId: string }) => {
    console.log('[LIB-ACTIONS] loveComment');
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return null;
        }

        if (comment.loves.includes(session.user.id)) {
            comment.loves = comment.loves.filter(
                (userId: string) => userId.toString() !== session.user.id
            );
        } else {
            comment.loves.push(session.user.id);
        }

        await comment.save();

        return JSON.parse(JSON.stringify(comment));
    } catch (error: any) {
        throw new Error(error);
    }
};
