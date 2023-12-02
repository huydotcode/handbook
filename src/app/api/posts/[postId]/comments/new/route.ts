import Comment from '@/models/Comment';
import User from '@/models/User';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';

export const POST = async (req: Request, { params }: Params) => {
    logger('API - POST: Send comment to post');
    const request = await req.json();
    const { postId } = params;
    const { content, userId, replyTo } = request;

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

            parentCommentId: replyTo || null,
            postId: postId,
            delete: false,
        };
        const newComment = new Comment(comment);
        if (replyTo) {
            const parentComment = await Comment.findById(replyTo);
            parentComment.replies.push(newComment._id);
            await parentComment.save();
        }

        await newComment.save();
        return new Response(JSON.stringify(newComment), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify(`Error with send comment: ${error}`),
            {
                status: 500,
            }
        );
    }
};
