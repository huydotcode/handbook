import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/services/mongoose';
import { Message } from '@/models';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
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
            .populate('sender')
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
