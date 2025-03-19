import User from '../models/user.model';
import Group from '../models/group.model';
import { NextFunction, Request, Response } from 'express';
import Post from '../models/post.model';
import { jwt } from '../utils/jwt';

class SearchController {
    async search(req: Request, res: Response, next: NextFunction) {
        const query = req.query.q as string;
        const pageString = req?.query?.page as string;
        const page: number = req?.query?.page ? parseInt(pageString) : 1;
        const pageSizeString = req?.query?.page_size as string;
        const pageSize =  req?.query?.limit ? parseInt(pageSizeString) : 10;

        const token: string = req.headers.authorization?.split(' ')[1] || "";
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = jwt.verify(token);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
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
                { type: "public" },
                { members: { $elemMatch: { user: user.id } } }
            ],
        })
            .skip((page - 1) * pageSize)
            .limit(pageSize).populate("avatar");

        console.log("groups", groups);

        const posts = await Post.find({
            $text: { $search: query },
            $or: [
                { option: 'public' },
                { option: 'private', author: user.id },
            ],
        })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const results = {
            users: users,
            groups: groups,
            posts: posts,
        }

        res.json(results); // { users, groups, posts }
    }
}

export default new SearchController();