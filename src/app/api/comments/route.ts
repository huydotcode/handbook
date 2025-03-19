import { Comment } from '@/models';
import { NextRequest, NextResponse } from 'next/server';
import { POPULATE_USER } from '@/lib/populate';

type Params = Promise<{ req: NextRequest }>;

export async function GET(req: NextRequest, segmentData: { params: Params }) {
    const searchParams = await req.nextUrl.searchParams;
    const postId = searchParams.get('postId');
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '5';

    try {
        const comments = await Comment.find({
            post: postId,
            replyComment: null,
        })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .populate('author', POPULATE_USER)
            .populate('replyComment')
            .populate('post')
            .populate('loves')
            .sort({ createdAt: -1 });

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
