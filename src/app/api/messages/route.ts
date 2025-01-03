import { Message } from '@/models';

export const GET = async (request: Request, response: Response) => {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId');
    const page = url.searchParams.get('page') || 1;
    const pageSize = url.searchParams.get('pageSize') || 10;

    try {
        const messages = await Message.find({
            conversation: conversationId,
        })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .populate('sender')
            .populate('conversation')
            .populate('images')
            .sort({ createdAt: -1 });

        return new Response(JSON.stringify(messages), { status: 200 });
    } catch (error) {
        return new Response(`Internal server error ${error}`, { status: 500 });
    }
};
