import { POPULATE_USER } from '@/lib/populate';
import { Notification } from '@/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');

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
        const notifications = await Notification.find({
            sender: userId,
        })
            .populate('sender', POPULATE_USER)
            .populate('receiver', POPULATE_USER);

        return NextResponse.json({
            notifications,
        });
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
