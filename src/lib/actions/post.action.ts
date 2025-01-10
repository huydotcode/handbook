'use server';
import { Comment, Group, Post, User } from '@/models';
import connectToDB from '@/services/mongoose';
import { getAuthSession } from '../auth';
import { revalidatePath } from 'next/cache';

const POPULATE_USER = 'name username avatar friends';
const POPULATE_GROUP = {
    path: 'group',
    populate: [
        { path: 'avatar' },
        { path: 'members.user' },
        { path: 'creator' },
    ],
};

export const getNewFeedPosts = async ({
    groupId,
    page,
    pageSize,
    type,
    userId,
    username,
    isManage = false,
}: {
    page: string;
    pageSize: string;
    groupId?: string;
    userId?: string;
    username?: string;
    type?: string;
    isManage?: boolean;
}) => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        const query: any = {};

        // Kiểm tra xem có phải là user hiện tại không
        const isCurrentUser =
            userId === session?.user.id || username === session?.user.username;

        // Kiểm tra xem có phải là user hiện tại không
        if (userId !== 'undefined' && userId && type !== 'group') {
            query.author = isCurrentUser ? session?.user.id : userId;
        } else if (username !== 'undefined') {
            const user = await User.findOne({ username });
            if (user) {
                query.author = user.id;
            }
        }

        query.option = isCurrentUser
            ? { $in: ['public', 'private'] }
            : 'public';

        if (type === 'group') {
            query.type = 'group';

            if (groupId !== 'undefined') {
                query.group = groupId;
            } else {
                const groupsHasJoin = await Group.find({
                    members: { $elemMatch: { user: session?.user.id } },
                }).distinct('_id');

                if (groupsHasJoin.length === 0) {
                    query.group = null;
                } else {
                    query.group = { $in: groupsHasJoin };
                }
            }
        } else {
            query.type = 'default';
        }

        if (isManage) {
            query.status = 'pending';
        } else {
            query.status = 'active';
        }

        let posts = await Post.find(query)
            .populate('author', POPULATE_USER)
            .populate('images')
            .populate(POPULATE_GROUP)
            .populate('loves', POPULATE_USER)
            .populate('shares', POPULATE_USER)
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ createdAt: -1 });

        // Filter posts by privacy settings
        if (posts.length > 0) {
            posts = posts.filter((post) => {
                if (post.group && isManage) {
                    return (
                        post.group.creator._id.toString() === session?.user.id
                    );
                }

                if (post.group) {
                    return post.group.members.some(
                        (member: any) => member.user === session?.user.id
                    );
                } else if (post.option === 'friends') {
                    return (
                        post.author.friends.includes(session?.user.id) ||
                        post.author._id.equals(session?.user.id)
                    );
                }
                return true;
            });
        }

        return JSON.parse(JSON.stringify(posts));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getPostByPostId = async ({ postId }: { postId: string }) => {
    try {
        await connectToDB();

        const post = await Post.findById(postId)
            .populate('author', POPULATE_USER)
            .populate('group', POPULATE_GROUP)
            .populate('images')
            .populate('loves', POPULATE_USER)
            .populate('shares', POPULATE_USER);

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
    type = 'default',
}: {
    content: string;
    images: any[];
    option: string;
    groupId?: string | null;
    type?: string;
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
            status: groupId ? 'pending' : 'active',
            type,
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

        await connectToDB();

        await Post.findByIdAndUpdate(postId, {
            text: content,
            images,
            option,
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
    } catch (error: any) {
        throw new Error(error);
    }
};
