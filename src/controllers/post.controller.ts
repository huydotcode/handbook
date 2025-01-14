import { NextFunction, Request, Response } from 'express';
import Post from '../models/post.model';
import { getSession } from '../utils/get-session';
import { POPULATE_USER } from '../utils/populate';

class PostController {
    // ROUTE: GET /api/posts
    public async getAllPosts(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const posts = await Post.find();
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    // ROUTE: GET /api/posts/:id
    public async getPostById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const post = await Post.findById(req.params.id);
            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    }

    // ROUTE: GET /api/v1/posts/new-feed
    public async getNewFeedPosts(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 3;

            const posts = await Post.find({
                $or: [
                    {
                        option: 'public',
                    },
                ],
            })
                .sort({ createdAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize);

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }
}

export default new PostController();
