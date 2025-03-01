import { NextFunction, Request, Response } from 'express';
import Comment from '../models/comment.model';

class CommentController {
    public async getCommentsByPost(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const post_id = req.query.post_id as string;
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const comments = await Comment.find({
                post: post_id,
                replyComment: null,
            })
                .sort({ createdAt: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size)
                .populate('author', 'name avatar username isVerified')
                .populate('loves', 'name avatar username')
                .populate('post');

            res.status(200).json(comments);
        } catch (error) {
            next(error);
        }
    }
}

export default new CommentController();
