'use server';
import { Comment, Media, Post } from '@/models';
import PostInteraction from '@/models/PostInteraction';
import connectToDB from '@/services/mongoose';
import { revalidatePath } from 'next/cache';
import { getAuthSession } from '../auth';

const POPULATE_USER = 'name username avatar friends isVerified';
const POPULATE_GROUP = {
    path: 'group',
    populate: [
        { path: 'avatar' },
        { path: 'members.user' },
        { path: 'creator' },
    ],
};

export const getPostByPostId = async ({ postId }: { postId: string }) => {
    try {
        await connectToDB();

        const post = await Post.findById(postId)
            .populate('author', POPULATE_USER)
            .populate(POPULATE_GROUP)
            .populate('media');

        return JSON.parse(JSON.stringify(post));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getSavedPosts = async ({ userId }: { userId: string }) => {
    try {
        await connectToDB();

        const savedInteractions = await PostInteraction.find({
            user: userId,
            type: 'save',
        })
            .populate('post')
            .populate('user', POPULATE_USER)
            .sort({ createdAt: -1 });

        const savedPosts = await Promise.all(
            savedInteractions.map(async (interaction) => {
                const post = interaction.post;
                if (!post) return null;

                const populatedPost = await Post.populate(post, {
                    path: 'media',
                    populate: { path: 'author', select: POPULATE_USER },
                });

                return JSON.parse(JSON.stringify(populatedPost));
            })
        );
        return JSON.parse(
            JSON.stringify({
                posts: savedPosts.filter((post) => post !== null),
            })
        );
    } catch (error: any) {
        throw new Error(error);
    }
};

export const createPost = async ({
    content,
    mediaIds,
    option,
    groupId = null,
    type = 'default',
    tags = [],
}: {
    content: string;
    mediaIds: string[];
    option: string;
    groupId?: string | null;
    type?: string;
    tags?: string[];
}) => {
    const session = await getAuthSession();
    if (!session) return;

    try {
        await connectToDB();

        const newPost = new Post({
            text: content,
            media: mediaIds,
            option,
            author: session.user.id,
            group: groupId,
            status: groupId ? 'pending' : 'active',
            type,
            tags: tags.map((tag) => tag.toLowerCase().replace(/^#/, '')),
        });
        await newPost.save();

        const post = await getPostByPostId({ postId: newPost._id });

        return JSON.parse(JSON.stringify(post));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const editPost = async ({
    content,
    mediaIds,
    option,
    postId,
    tags = [],
}: {
    content: string;
    mediaIds: string[];
    option: string;
    postId: string;
    tags?: string[];
}) => {
    try {
        const session = await getAuthSession();
        if (!session) return;

        await connectToDB();

        await Post.findByIdAndUpdate(postId, {
            text: content,
            media: mediaIds,
            option,
            tags,
        });

        const post = await getPostByPostId({ postId });

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

        const postInteractionExists = await PostInteraction.findOne({
            user: userId,
            post: postId,
            type: 'love',
        });

        if (postInteractionExists) {
            console.log('Post interaction exists, removing love reaction');
            await PostInteraction.findByIdAndDelete(postInteractionExists._id);
            await Post.updateOne({ _id: postId }, { $inc: { lovesCount: -1 } });
        } else {
            console.log('Creating new post interaction for love reaction');
            const newPostInteraction = new PostInteraction({
                user: userId,
                post: postId,
                type: 'love',
            });
            await newPostInteraction.save();
            await Post.updateOne({ _id: postId }, { $inc: { lovesCount: 1 } });
        }

        // Cập nhật lại post để phản ánh số lượng tương tác
        await post.save();
        console.log('Post interaction updated successfully');

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const sharePost = async ({ postId }: { postId: string }) => {
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) return;

        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        const userId = session.user.id;
        const postInteractionExists = await PostInteraction.findOne({
            user: userId,
            post: postId,
            type: 'share',
        });

        if (postInteractionExists) {
            await PostInteraction.findByIdAndDelete(postInteractionExists._id);
            await Post.updateOne(
                { _id: postId },
                { $inc: { sharesCount: -1 } }
            );
        } else {
            const newPostInteraction = new PostInteraction({
                user: userId,
                post: postId,
                type: 'share',
            });
            await newPostInteraction.save();
            await Post.updateOne({ _id: postId }, { $inc: { sharesCount: 1 } });
        }
        await post.save();

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const deletePost = async ({ postId }: { postId: string }) => {
    try {
        await connectToDB();

        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        // Xóa media liên quan đến bài viết
        if (post.media && post.media.length > 0) {
            for (const mediaId of post.media) {
                const media = await Media.findById(mediaId);
                if (media) {
                    await Media.findByIdAndDelete(mediaId);
                }
            }
        }

        // Xóa comment
        await Comment.deleteMany({ postId: postId });

        // Xóa bài viết
        await Post.findByIdAndDelete(postId);

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const updateStatusPost = async ({
    postId,
    status,
    path,
}: {
    postId: string;
    status: string;
    path: string;
}) => {
    try {
        await connectToDB();

        if (status === 'active') {
            await Post.updateOne({ _id: postId }, { status });
        } else {
            await Post.findByIdAndDelete(postId);
            await Comment.deleteMany({ postId: postId });
        }

        revalidatePath(path);

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const savePost = async ({
    postId,
    path,
}: {
    postId: string;
    path?: string;
}) => {
    try {
        const session = await getAuthSession();
        if (!session) return;

        await connectToDB();

        await PostInteraction.create({
            user: session.user.id,
            post: postId,
            type: 'save',
        });

        if (path) revalidatePath(path);
        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const unsavePost = async ({
    postId,
    path,
}: {
    postId: string;
    path?: string;
}) => {
    try {
        const session = await getAuthSession();
        if (!session) return;

        await connectToDB();

        await PostInteraction.findOneAndDelete({
            user: session.user.id,
            post: postId,
            type: 'save',
        });

        if (path) revalidatePath(path);
        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};
