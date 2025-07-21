import { NextFunction, Request, Response } from 'express';
import Group from '../models/group.model';
import User from '../models/user.model';
import { getPostsWithInteraction } from '../services/post.service';
import { getDecodedTokenFromHeaders, jwt } from '../utils/jwt';
import { POPULATE_USER } from '../utils/populate';

class SearchController {
    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query.q as string;
            const pageString = req?.query?.page as string;
            const page: number = req?.query?.page ? parseInt(pageString) : 1;
            const pageSizeString = req?.query?.page_size as string;
            const pageSize = req?.query?.limit ? parseInt(pageSizeString) : 10;

            const token: string =
                req.headers.authorization?.split(' ')[1] || '';
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const user = jwt.verify(token);

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const users = await User.find({
                $text: { $search: query },
                id: {
                    $ne: user.id,
                },
            })
                .skip((page - 1) * pageSize)
                .limit(pageSize);

            const groups = await Group.find({
                $text: { $search: query },
                $or: [
                    { type: 'public' },
                    { members: { $elemMatch: { user: user.id } } },
                ],
            })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .populate('avatar');

            const posts = await getPostsWithInteraction({
                filter: {
                    $text: { $search: query },
                    status: 'active',
                },
                userId: user.id,
                page: page,

                pageSize: pageSize,
                sort: { createdAt: -1 },
            });

            const results = {
                users: users,
                groups: groups,
                posts: posts,
            };

            res.json(results);
        } catch (error) {
            console.error('Error searching:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async searchUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query.q as string;
            const pageString = req.query.page as string;
            const page: number = req.query.page ? parseInt(pageString) : 1;
            const pageSizeString = req.query.page_size as string;
            const pageSize = req.query.page_size
                ? parseInt(pageSizeString)
                : 10;

            const decoded = await getDecodedTokenFromHeaders(req.headers);
            if (!decoded) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const users = await User.find({
                $text: { $search: query },
                id: {
                    $ne: decoded.id,
                },
            })
                .populate(POPULATE_USER)
                .skip((page - 1) * pageSize)
                .limit(pageSize);

            res.json({
                users: users,
                isNext: users.length === pageSize,
            });
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async searchGroups(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query.q as string;
            const pageString = req.query.page as string;
            const page: number = req.query.page ? parseInt(pageString) : 1;
            const pageSizeString = req.query.page_size as string;
            const pageSize = req.query.page_size
                ? parseInt(pageSizeString)
                : 10;
            const decoded = await getDecodedTokenFromHeaders(req.headers);
            if (!decoded) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const groups = await Group.find({
                $text: { $search: query },
                $or: [
                    { type: 'public' },
                    { members: { $elemMatch: { user: decoded.id } } },
                ],
            })
                .populate('avatar')
                .populate({
                    path: 'members.user',
                    select: 'name avatar',
                });
            res.json({
                groups: groups,
                isNext: groups.length === pageSize,
            });
        } catch (error) {
            console.error('Error searching groups:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async searchPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query.q as string;
            const pageString = req.query.page as string;
            const page: number = req.query.page ? parseInt(pageString) : 1;
            const pageSizeString = req.query.page_size as string;
            const pageSize = req.query.page_size
                ? parseInt(pageSizeString)
                : 10;
            const decoded = await getDecodedTokenFromHeaders(req.headers);
            if (!decoded) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const posts = await getPostsWithInteraction({
                filter: {
                    $text: { $search: query },
                    status: 'active',
                },
                userId: decoded.id,
                page: page,
                pageSize: pageSize,
                sort: { createdAt: -1 },
            });

            res.json(posts);
        } catch (error) {
            console.error('Error searching posts:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new SearchController();
