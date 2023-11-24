import Comment from '@/models/Comment';
import Post from '@/models/Post';
import logger from '@/utils/logger';

export async function GET(request: Request, { params }: Params) {
    logger('API - GET: Get post data');
    const { postId } = params;

    if (!postId) {
        return new Response('Invalid post id', { status: 500 });
    }

    try {
        const post = await Post.findById(postId);

        // TODO: Add comment count
        const commentCount = await Comment.countDocuments({ postId: postId });
        post.commentCount = commentCount;

        return new Response(JSON.stringify(post), { status: 200 });
    } catch (error) {
        return new Response('Failed to get post', {
            status: 500,
        });
    }
}

export async function DELETE(request: Request, { params }: Params) {
    logger('API - DELETE: Delete post');
    const { postId } = params;

    try {
        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ postId: postId });

        return new Response('Success to delete post', { status: 200 });
    } catch (error) {
        return new Response('Failed to delete post', {
            status: 500,
        });
    }
}
