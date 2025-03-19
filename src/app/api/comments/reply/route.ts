import { Comment } from '@/models';
import { NextRequest, NextResponse } from 'next/server';
import { POPULATE_USER } from '@/lib/populate';

type Params = Promise<{ req: NextRequest }>;

export async function GET(req: NextRequest, segmentData: { params: Params }) {
    const searchParams = await req.nextUrl.searchParams;
    const commentId = searchParams.get('commentId');
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '5';

    try {
        const comments = await Comment.find({
            replyComment: commentId,
        })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .sort({ createdAt: -1 })
            .populate('author', POPULATE_USER)
            .populate('replyComment')
            .populate('post')
            .populate('loves');

        return NextResponse.json(comments, {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Lỗi lấy thông tin bình luận',
            },
            {
                status: 500,
            }
        );
    }
}
