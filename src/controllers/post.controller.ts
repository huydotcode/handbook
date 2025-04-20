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
        next: NextFunction,
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
        next: NextFunction,
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
        next: NextFunction,
    ): Promise<void> {
        try {
            const user_id = req.query.user_id as string;
            const user = await User.findById(user_id).populate(POPULATE_USER);
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
                status: 'active',
            })
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    // ROUTE: GET /api/v1/posts/new-feed-friend
    public async getNewFeedFriendPosts(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const user_id = req.query.user_id as string;
            const user = await User.findById(user_id).populate(POPULATE_USER);
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const posts = await Post.find({
                author: {
                    $in: user?.friends,
                },
                status: 'active',
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
        next: NextFunction,
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
                status: 'active',
            })
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    // ROUTE: GET /api/v1/posts/profile/:user_id
    public async getProfilePosts(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const user_id = req.params.user_id;
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const posts = await Post.find({
                author: user_id,
                group: null,
                status: 'active',
            })
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    // ROUTE: GET /api/v1/posts/group/:group_id
    public async getGroupPosts(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const group_id = req.params.group_id;
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const posts = await Post.find({
                group: group_id,
                status: 'active',
            })
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    // ROUTE: POST /api/v1/posts/group/:group_id/manage
    public async getManageGroupPosts(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const group_id = req.params.group_id;
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const posts = await Post.find({
                group: group_id,
                status: 'active',
            })
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

            console.log({
                group_id,
                page,
                page_size,
                posts,
            });

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    // ROUTE: POST /api/v1/posts/group/:group_id/manage
    public async getManageGroupPostsPending(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const group_id = req.params.group_id;
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const posts = await Post.find({
                group: group_id,
                status: 'pending',
            })
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

            console.log({
                group_id,
                page,
                page_size,
                posts,
            });

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    public async getPostByMember(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { user_id, group_id } = req.query;
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const posts = await Post.find({
                author: user_id,
                group: group_id,
                status: 'active',
            })
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

            res.status(200).json(posts);
        } catch (e) {
            next(e)
        }
    }
}

export default new PostController();
