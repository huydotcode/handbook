import { POPULATE_USER } from '@/lib/populate';
import { Notification } from '@/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';

    if (!userId) {
        return NextResponse.json(
            {
                message: 'userId is required',
            },
            {
                status: 400,
            }
        );
    }

    try {
        const requests = await Notification.find({
            sender: userId,
        })
            .sort({ createdAt: -1 })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .populate('sender', POPULATE_USER)
            .populate('receiver', POPULATE_USER);

        return NextResponse.json(requests, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
