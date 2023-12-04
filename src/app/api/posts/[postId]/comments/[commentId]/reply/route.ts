import Comment from '@/models/Comment';
import connectToDB from '@/services/mongoose';

export const GET = async (req: Request, { params }: Params) => {
    const { commentId, postId } = params;

    if (!commentId)
        return new Response('commentId is required', { status: 400 });
    if (!postId) return new Response('postId is required', { status: 400 });

    try {
        await connectToDB();
        const comments = await Comment.find({ parentCommentId: commentId });

        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
};
