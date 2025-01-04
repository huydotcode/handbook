import { Item } from '@/models';
import connectToDB from '@/services/mongoose';
import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ req: NextRequest }>;

export async function GET(req: NextRequest, segmentData: { params: Params }) {
    const searchParams = await req.nextUrl.searchParams;
    const page = searchParams.get('page') || 1;
    const pageSize = searchParams.get('pageSize') || 20;

    try {
        await connectToDB();

        const items = await Item.find({})
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ createdAt: -1 })
            .populate('category')
            .populate('seller')
            .populate('images');

        return NextResponse.json(items, {
            status: 200,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
