import Comment from '@/models/Comment';
import Post from '@/models/Post';
import User from '@/models/User';
import connectToDB from '@/services/mongoose';

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    const page = searchParams.get('page') || 1;
    const pageSize = searchParams.get('pageSize') || 5;

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

        return new Response(JSON.stringify(posts), { status: 200 });
    } catch (error: any) {
        return new Response(error.message, { status: 500 });
    }
};
