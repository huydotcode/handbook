import SavedPost from '@/models/SavedPost';
import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ req: NextRequest }>;

export async function GET(
    request: NextRequest,
    segmentData: { params: Params }
) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    try {
        const savedPosts = await SavedPost.find({
            userId: userId,
        });

        return NextResponse.json(savedPosts);
    } catch (error: any) {
        return NextResponse.json({
            message: 'Error',
            error: error.message,
        });
    }
}
