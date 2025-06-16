import {
    deleteComment,
    loveComment,
    sendComment,
} from '../actions/comment.action';

class CommentServiceClass {
    public async create({
        content,
        replyTo,
        postId,
    }: {
        content: string;
        replyTo: string | null;
        postId: string;
    }) {
        await sendComment({
            content,
            replyTo,
            postId,
        });
    }

    public async love(commentId: string) {
        await loveComment({
            commentId,
        });
    }

    public async delete(commentId: string) {
        await deleteComment({
            commentId,
        });
    }
}

const CommentService = new CommentServiceClass();
export default CommentService;
