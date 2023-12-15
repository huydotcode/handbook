import Comment from '@/models/Comment';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';

export async function GET(request: Request, { params }: IParams) {
    logger('API - GET Comments');
    const { postId } = params;

    try {
        await connectToDB();

        const comments = await Comment.find({ postId: postId }).limit(25).sort({
            createdAt: -1,
        });

        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error) {
        return new Response(`Error GET Comments: ${error}`, { status: 500 });
    }
}
