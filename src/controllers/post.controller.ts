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

        /*
            {
                id: '65f98b41a1fb29ea5968a4ca',
                name: 'Ngô Nhựt Huy 1',
                email: 'ngonhuthuy@gmail.com',
                picture: '/assets/img/user-profile.jpg',
                role: 'user',
                username: 'ngonhuthuy',
                iat: 1736822919,
                exp: 1736909319
            }
        */

        if (!sessionUser) {
            res.status(401).json({
                message: 'Unauthorized',
            });
            return;
        }

        try {
            const user = await User.findById(sessionUser.id);

            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 3;

            const posts = await Post.find({
                $or: [
                    {
                        author: {
                            $in: user.friends,
                        },
                    },
                    {
                        option: 'public',
                    },
                ],
            })
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize);

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }
}

export default new PostController();
