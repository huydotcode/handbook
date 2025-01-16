import { NextFunction, Request, Response } from 'express';
import Post from '../models/post.model';
import { getSession } from '../utils/get-session';
import { POPULATE_USER } from '../utils/populate';
import User from '../models/user.model';

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
        const sessionUser = await getSession(req);

        try {
            const user_id = req.query.user_id as string;
            const user = await User.findById(sessionUser?.id).populate(
                POPULATE_USER
            );
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const posts = await Post.find({
                $or: [
                    {
                        user: {
                            $in: user?.friends,
                        },
                    },
                    {
                        option: 'public',
                    },
                ],
            })
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    // ROUTE: GET /api/v1/posts/new-feed-group
    public async getNewFeedGroupPosts(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user_id = req.query.user_id as string;
            const user = await User.findById(user_id).populate(POPULATE_USER);
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const posts = await Post.find({
                group: {
                    $in: user?.groups,
                },
            })
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }
}

export default new PostController();
