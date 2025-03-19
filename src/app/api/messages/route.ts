import { Message } from '@/models';
import { NextRequest } from 'next/server';
import { POPULATE_USER } from '@/lib/populate';

type Params = Promise<{ req: NextRequest }>;

export async function GET(req: NextRequest, segmentData: { params: Params }) {
    const searchParams = await req.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');
    const page = searchParams.get('page') || 1;
    const pageSize = searchParams.get('pageSize') || 10;

    try {
        const messages = await Message.find({
            conversation: conversationId,
        })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('images')
            .sort({ createdAt: -1 });

        return new Response(JSON.stringify(messages), { status: 200 });
    } catch (error) {
        return new Response(`Internal server error ${error}`, { status: 500 });
    }
}
