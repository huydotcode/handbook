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
    const session = await getAuthSession();
    const query = {} as any;

    console.log({
        groupId,
        page,
        pageSize,
        path,
        type,
        userId,
        username,
    });

    if (userId !== 'undefined' || username !== 'undefined') {
        // Kiểm tra xem có phải là user đang đăng nhập không
        if (userId == session?.user.id || username == session?.user.username) {
            query.author = session?.user.id;
            query.option = {
                $in: ['public', 'private'],
            };
        } else {
            query.option = 'public';

            if (userId !== 'undefined' && userId) {
                query.author = userId;
            } else {
                const user = await User.findOne({ username });
                if (user) {
                    query.author = user.id;
                }
            }
        }
    }

    // Lấy những bài post trong group của user đang tham gia
    if (type == 'group' && groupId == 'undefined') {
        // Lấy những group mà user đang tham gia
        let groupsHasJoin = await Group.find({
            members: {
                $elemMatch: {
                    user: {
                        $eq: session?.user.id,
                    },
                },
            },
        });

        groupsHasJoin = groupsHasJoin.flatMap((group) => group._id);

        query.group = {
            $in: groupsHasJoin,
        };
    } else {
        if (groupId !== 'undefined') {
            query.group = groupId;
        }
    }

    try {
        let posts = await Post.find(query)
            .populate('author', POPULATE_USER)
            .populate('images')
            .populate('group', POPULATE_GROUP)
            .populate('loves', POPULATE_USER)
            .populate('shares', POPULATE_USER)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: POPULATE_USER,
                },
            })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ createdAt: -1 });

        // Nếu là chế độ chỉ bạn bè thì kiểm tra xem có phải là bạn bè không
        posts = posts.filter((post) => {
            if (post.option == 'friends') {
                if (post.author.friends.includes(session?.user.id)) {
                    return post;
                }
            } else if (post.group) {
                if (
                    post.group.members.find(
                        (member: any) => member.user == session?.user.id
                    )
                ) {
                    return post;
                }
            }

            return post;
        });

        return JSON.parse(JSON.stringify(posts));
    } catch (error: any) {
        throw new Error(error);
    }
};

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
            status: groupId ? 'pending' : 'active',
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
