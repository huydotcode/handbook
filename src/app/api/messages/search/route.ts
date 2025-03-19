import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/services/mongoose';
import { Message } from '@/models';
import { POPULATE_USER } from '@/lib/populate';

type Params = Promise<{ req: NextRequest }>;

export async function GET(req: NextRequest, segmentData: { params: Params }) {
    const searchParams = await req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const conversationId = searchParams.get('conversationId');

    try {
        await connectToDB();

        const messages = await Message.find({
            conversation: conversationId,
            text: {
                $regex: search,
                $options: 'i',
            },
        })
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('images')
            .sort({ createdAt: -1 });

        return NextResponse.json(messages, {
            status: 200,
        });
    } catch (error) {
        throw new Error('Internal server error');
    }
}
