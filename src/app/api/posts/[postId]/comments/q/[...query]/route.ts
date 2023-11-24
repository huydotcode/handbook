import Comment from '@/models/Comment';
import logger from '@/utils/logger';

export const GET = async (req: Request, { params }: Params) => {
    logger('API - GET Comments');
    const url = new URL(req.url);

    const page = url.searchParams.get('page') || 1;
    const pageSize = url.searchParams.get('pageSize') || 10;

    try {
        const comments = await Comment.find({
            postId: params.postId,
            parentCommentId: null,
        })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ createdAt: -1 });

        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error: any) {
        return new Response(error, { status: 500 });
    }
};
