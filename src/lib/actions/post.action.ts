'use server';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import User from '@/models/User';
import connectToDB from '@/services/mongoose';
import { Session } from 'next-auth';
import { getAuthSession } from '../auth';

export const createPost = async ({
    content,
    images,
    option,
}: {
    content: string;
    images: any[];
    option: string;
}) => {
    const session = (await getAuthSession()) as Session;
    if (!session) return;

    try {
        await connectToDB();

        const user = await User.findById(session.user.id).populate(
            'name image'
        );

        const newPost = await new Post({
            option: option,
            content: content,
            images: images,
            creator: user,
        });

        await newPost.save();
        return JSON.parse(JSON.stringify(newPost));
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};

export const fetchNewFeedPost = async ({
    page = 1,
    pageSize = 5,
    userId = '',
    username = '',
}: {
    userId: string | undefined;
    username: string | undefined;
    page: number;
    pageSize: number;
}) => {
    let query = {} as any;

    if (userId || username) {
        let user;

        if (userId) {
            user = await User.findOne({ _id: userId });
        } else if (username) {
            user = await User.findOne({ username });
        }

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

        return JSON.parse(JSON.stringify(posts));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getCountCommentsParent = async ({
    postId,
}: {
    postId: string;
}) => {
    await connectToDB();
    const count = await Comment.find({
        postId: postId,
        parent_id: null,
    }).countDocuments();

    return count;
};

export const fetchCommentPostId = async ({
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
            postId: postId,
            parent_id: null,
        })
            .limit(+page * +pageSize)
            .sort({ replies: -1, isDeleted: 1, createdAt: -1 });

        return JSON.parse(JSON.stringify(comments));
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
};

export const fetchReplyComments = async ({
    commentId,
    commentsHasShow,
    page,
}: {
    commentId: string;
    commentsHasShow: Comment[];
    page: number;
}) => {
    const pageSize = 5;

    if (!commentId) return;

    try {
        await connectToDB();
        const comments = await Comment.find({
            parent_id: commentId,
            _id: { $nin: commentsHasShow },
        })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ replies: -1, isDeleted: 1, createdAt: -1 });

        return JSON.parse(JSON.stringify(comments));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const fetchReplyCommentsCount = async ({
    commentId,
    commentsHasShow,
}: {
    commentId: string;
    commentsHasShow: Comment[];
}) => {
    if (!commentId) return;

    try {
        await connectToDB();
        const count = await Comment.find({
            parent_id: commentId,
            _id: { $nin: commentsHasShow },
        }).countDocuments();

        return count;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const sendComment = async ({
    content,
    replyTo,
    userId,
    postId,
}: {
    userId: string;
    content: string;
    replyTo: string | null;
    postId: string;
}) => {
    try {
        await connectToDB();

        const user = (await User.findById(userId)) as User;
        if (!user) {
            return new Response(`User not found`, { status: 500 });
        }

        const comment = {
            content: content,
            userInfo: {
                id: user.id,
                image: user.image,
                name: user.name,
            },
            parent_id: replyTo || null,
            postId: postId,
            isDeleted: false,
        };
        const newComment = new Comment(comment);
        if (replyTo) {
            const parentComment = await Comment.findById(replyTo);
            parentComment.replies.push(newComment._id);
            await parentComment.save();
        }
        await newComment.save();

        return JSON.parse(JSON.stringify(newComment));
    } catch (error) {
        throw new Error(`Error with send comment: ${error}`);
    }
};

export const deleteComment = async ({ commentId }: { commentId: string }) => {
    if (!commentId) return;

    try {
        await connectToDB();

        // If comment has replies set isDeleted = true else if comment has not replies delete comment
        const cmt = await Comment.findById(commentId);

        if (!cmt) {
            throw new Error(`Comment not found`);
        }

        if (cmt.replies.length > 0) {
            cmt.isDeleted = true;
            await cmt.save();
        } else {
            await Comment.findByIdAndDelete(commentId);
        }
    } catch (error) {
        throw new Error(`Error with delete comment: ${error}`);
    }
};

export const sendReaction = async ({
    userId,
    postId,
}: {
    userId: string;
    postId: string;
}) => {
    try {
        await connectToDB();

        const post = await Post.findById(postId);

        if (!post || !userId) {
            throw new Error(`Post or user not found`);
        }

        // Check if user already reacted
        const isUserReacted = post.loves.some((item: any) =>
            item.equals(userId)
        );

        if (isUserReacted) {
            post.loves = post.loves.filter((item: any) => !item.equals(userId));
        } else {
            post.loves.push(userId);
        }

        await post.save();
    } catch (error) {
        throw new Error(`Error with send reactions: ${error}`);
    }
};

export const deletePost = async ({ postId }: { postId: string }) => {
    try {
        await connectToDB();
        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ postId: postId });
    } catch (error: any) {
        console.log('Error: ', error);
        throw new Error(error);
    }
};
