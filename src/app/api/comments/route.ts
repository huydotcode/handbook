import { Comment, Message } from '@/models';

export const GET = async (request: Request, response: Response) => {
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    const page = url.searchParams.get('page') || 1;
    const pageSize = url.searchParams.get('pageSize') || 10;

    try {
        const comments = await Comment.find({
            post: postId,
        })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .populate('author')
            .populate('replyComment')
            .populate('post')
            .populate('loves')
            .sort({ createdAt: -1 });

        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error) {
        return new Response('Internal server error', { status: 500 });
    }
};
