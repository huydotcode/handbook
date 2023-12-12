import Comment from '@/models/Comment';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';

export const GET = async (req: Request, { params }: Params) => {
    const { commentId } = params;
    try {
        await connectToDB();
        const comment = await Comment.findById(commentId);

        return new Response(JSON.stringify(comment), { status: 201 });
    } catch (error) {
        return new Response('Error', { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: Params) => {
    const { postId, commentId } = params;
    logger('API - DELETE: Delete comment post');

    if (!postId || !commentId) {
        return new Response('Id has value undefined', { status: 500 });
    }

    try {
        await connectToDB();
        const comment = await Comment.findOneAndUpdate(
            { _id: commentId },
            {
                isDeleted: true,
            }
        );
        comment.save();

        return new Response(JSON.stringify('Success to delete comment:'), {
            status: 200,
        });
    } catch (error) {
        return new Response(`Error with delete comment: ${error}`, {
            status: 500,
        });
    }
};
