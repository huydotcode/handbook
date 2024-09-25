'use server';
import { Comment, Group, Post, User } from '@/models';
import connectToDB from '@/services/mongoose';
import { getAuthSession } from '../auth';

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

const POPULATE_USER = 'name username avatar friends';
const POPULATE_GROUP = 'name avatar members';

export const getNewFeedPosts = async ({
    groupId,
    page,
    pageSize,
    path,
    type,
    userId,
    username,
}: {
    page: string;
    pageSize: string;
    groupId: string;
    userId: string;
    username: string;
    type: string;
    path: string;
}) => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        const query: any = {};

        // Kiểm tra xem có phải là user hiện tại không
        const isCurrentUser =
            userId === session?.user.id || username === session?.user.username;

        // Kiểm tra xem có phải là user hiện tại không
        if (userId !== 'undefined' && userId) {
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
            if (groupId !== 'undefined') {
                query.group = groupId;
            } else {
                const groupsHasJoin = await Group.find({
                    members: { $elemMatch: { user: session?.user.id } },
                }).distinct('_id');
                query.group = { $in: groupsHasJoin };
            }
        }

        let posts = await Post.find(query)
            .populate('author', POPULATE_USER)
            .populate('images')
            .populate('group', POPULATE_GROUP)
            .populate('loves', POPULATE_USER)
            .populate('shares', POPULATE_USER)
            .populate({
                path: 'comments',
                populate: { path: 'author', select: POPULATE_USER },
            })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ createdAt: -1 });

        // Filter posts by privacy settings
        posts = posts.filter((post) => {
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
            status: groupId ? 'pending' : 'active',
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
