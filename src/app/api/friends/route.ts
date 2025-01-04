import { POPULATE_USER } from '@/lib/populate';
import { User } from '@/models';
import connectToDB from '@/services/mongoose';
import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ req: NextRequest }>;

export async function GET(req: NextRequest, segmentData: { params: Params }) {
    const searchParams = await req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';

    try {
        await connectToDB();

        const user = await User.findById(userId).populate(POPULATE_USER);
        const friends = (user && user.friends) || [];

        return NextResponse.json(friends, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error,
            },
            {
                status: 500,
            }
        );
    }
}
