import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Follows from '../models/follow.model';
import Post from '../models/post.model';
import PostInteraction from '../models/post_interaction.model';
import User from '../models/user.model';
import { getPostsWithInteraction } from '../services/post.service';
import { IPost } from '../types';
import { getDecodedTokenFromHeaders } from '../utils/jwt';
import { POPULATE_GROUP, POPULATE_USER } from '../utils/populate';

class PostController {
    // ROUTE: POST /api/posts
    public async createPost(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
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
            const token = await getDecodedTokenFromHeaders(req.headers);
            if (!token) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const post = await Post.findOne({
                _id: new Types.ObjectId(req.params.id),
            })
                .populate('media')
                .populate('author', POPULATE_USER)
                .populate(POPULATE_GROUP)
                .lean<IPost>();

            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }

            const interactions = await PostInteraction.find({
                post: post._id,
                user: token.id,
                type: { $in: ['love', 'share', 'save'] },
            }).lean();

            const isLoved = interactions.some((i) => i.type === 'love');
            const isShared = interactions.some((i) => i.type === 'share');
            const isSaved = interactions.some((i) => i.type === 'save');

            post.userHasLoved = isLoved;
            post.userHasShared = isShared;
            post.userHasSaved = isSaved;

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

            const followings = await Follows.find({
                follower: user_id,
            })
                .select('following')
                .lean();

            const posts = await getPostsWithInteraction({
                filter: {
                    $or: [
                        {
                            author: {
                                $in: followings.map((f) => f.following),
                            },
                            option: 'public',
                        },
                        {
                            author: {
                                $in: user?.friends,
                            },
                            option: {
                                $in: ['friends', 'public'],
                            },
                        },
                    ],
                },
                userId: user_id,
                page,
                pageSize: page_size,
            });

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

            const posts = await getPostsWithInteraction({
                filter: {
                    author: {
                        $in: user?.friends,
                    },
                },
                userId: user_id,
                page,
                pageSize: page_size,
            });

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

            const posts = await getPostsWithInteraction({
                filter: {
                    group: {
                        $in: user?.groups,
                    },
                    status: 'active',
                },
                userId: user_id,
                page,
                pageSize: page_size,
            });

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

            const posts = await getPostsWithInteraction({
                filter: {
                    author: user_id,
                    group: null,
                    status: 'active',
                },
                userId: user_id,
                page,
                pageSize: page_size,
            });

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
            const token = await getDecodedTokenFromHeaders(req.headers);

            if (!token) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const posts = await getPostsWithInteraction({
                filter: {
                    group: group_id,
                    status: 'active',
                },
                userId: token.id,
                page,
                pageSize: page_size,
            });

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
            const token = await getDecodedTokenFromHeaders(req.headers);

            if (!token) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const group_id = req.params.group_id;
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const posts = await getPostsWithInteraction({
                filter: {
                    group: group_id,
                    status: 'active',
                },
                userId: token.id,
                page,
                pageSize: page_size,
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
            const token = await getDecodedTokenFromHeaders(req.headers);

            if (!token) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const posts = await Post.find({
                group: group_id,
                status: 'pending',
            })
                .populate('media')
                .populate('author', POPULATE_USER)
                .populate(POPULATE_GROUP)
                .sort({ createdAt: -1, loves: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

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
            const userId = user_id as string;

            const posts = await getPostsWithInteraction({
                filter: {
                    author: user_id,
                    group: group_id,
                    status: 'active',
                },
                userId,
                page,
                pageSize: page_size,
            });

            res.status(200).json(posts);
        } catch (e) {
            next(e);
        }
    }

    // ROUTE: GET /api/v1/posts/saved
    public async getSavedPosts(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const token = await getDecodedTokenFromHeaders(req.headers);
            if (!token) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const user_id = token.id;
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 3;

            const posts = await PostInteraction.find({
                user: user_id,
                type: 'save',
            })
                .populate('post')
                .sort({ createdAt: -1 })
                .skip((page - 1) * page_size)
                .limit(page_size);

            // populate posts
            const postIds = posts.map((interaction) => interaction.post._id);
            const populatedPosts = await Post.find({
                _id: { $in: postIds },
            })
                .populate('media')
                .populate('author', POPULATE_USER)
                .populate(POPULATE_GROUP)
                .lean<IPost[]>();

            // Gắn thông tin tương tác vào từng post
            const interactionMap = new Map();
            posts.forEach((interaction) => {
                const postId = interaction.post._id.toString();
                interactionMap.set(postId, {
                    love: false,
                    share: false,
                    save: true,
                });
                console.log('interactionMap', interactionMap);
                console.log('postId', postId);
            });
            populatedPosts.forEach((post) => {
                const postId = post._id.toString();
                if (interactionMap.has(postId)) {
                    const interaction = interactionMap.get(postId);
                    post.userHasLoved = interaction.love;
                    post.userHasShared = interaction.share;
                    post.userHasSaved = interaction.save;
                } else {
                    post.userHasLoved = false;
                    post.userHasShared = false;
                    post.userHasSaved = false;
                }
            });

            res.status(200).json(populatedPosts);
        } catch (error) {
            next(error);
        }
    }
}

export default new PostController();
