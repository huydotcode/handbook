import { NextFunction, Request, Response } from 'express';
import Comment from '../models/comment.model';
import { POPULATE_USER } from '../utils/populate';

class CommentController {
    public async getCommentsByPost(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const postId = req.query.post_id as string;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.page_size as string) || 3;

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

            res.status(200).json(comments);
        } catch (error) {
            next(error);
        }
    }

    public async getReplyComments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const commentId = req.query.comment_id as string;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.page_size as string) || 3;

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

            res.status(200).json(comments);
        } catch (error) {
            next(error);
        }
    }
}

export default new CommentController();
