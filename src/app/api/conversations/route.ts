import { POPULATE_USER } from '@/lib/populate';
import { Conversation } from '@/models';
import connectToDB from '@/services/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            {
                error: 'userId is required',
            },
            { status: 400 }
        );
    }

    try {
        await connectToDB();

        const conversations = await Conversation.find({
            participants: {
                $elemMatch: { $eq: userId },
            },
        })
            .populate('participants', POPULATE_USER)
            .populate('creator', POPULATE_USER)
            .populate('group');

        return NextResponse.json(conversations, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Internal server error',
            },
            { status: 500 }
        );
    }
}
