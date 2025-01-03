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
        const notifications = await Notification.find({
            receiver: userId,
        })
            .sort({ createdAt: -1 }) // Sắp xếp trước
            .skip((+page - 1) * +pageSize) // Bỏ qua các bản ghi không cần thiết
            .limit(+pageSize) // Lấy số lượng bản ghi cần thiết
            .populate('sender', POPULATE_USER) // Populate sau cùng
            .populate('receiver', POPULATE_USER);

        return NextResponse.json(notifications, {
            status: 200,
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
