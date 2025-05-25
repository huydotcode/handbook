import { NextFunction, Request, Response } from 'express';
import Post from '../models/post.model';
import User from '../models/user.model';
import { POPULATE_GROUP, POPULATE_USER } from '../utils/populate';

class PostController {
    // ROUTE: POST /api/posts
    public async createPost(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log('createPost called with body:', req.body);
            const postData = req.body;
            const newPost = new Post(postData);
            await newPost.save();
            res.status(201).json(newPost);
        } catch (error) {
            next(error);
        }
    }

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
            console.log('getPostById called with id:', req.params.id);
            const post = await Post.findById(req.params.id)
                .populate('media')
                .populate('author', POPULATE_USER)
                .populate(POPULATE_GROUP)
                .populate('loves', POPULATE_USER)
                .populate('shares', POPULATE_USER);

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
            const user_id = req.query.user_id as string;
            const user = await User.findById(user_id).populate(POPULATE_USER);
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            console.log('User:', user);

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
                .populate('author', POPULATE_USER)
                .populate('group', POPULATE_GROUP)
                .populate('media')

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
        next: NextFunction
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
        next: NextFunction
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
        next: NextFunction
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
        next: NextFunction
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
        next: NextFunction
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
        next: NextFunction
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
            next(e);
        }
    }
}

export default new PostController();
