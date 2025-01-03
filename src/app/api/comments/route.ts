import { Comment } from '@/models';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest, response: Response) => {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '5';

    try {
        const comments = await Comment.find({
            post: postId,
        })
            .skip((+page - 1) * +pageSize)
            .limit(+pageSize)
            .populate('author')
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
};
