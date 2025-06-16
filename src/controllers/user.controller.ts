import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import { POPULATE_USER } from '../utils/populate';

class UserController {
    public async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.page_size as string) || 10;

            const users = await User.find({})
                .populate(POPULATE_USER)
                .skip((+page - 1) * +pageSize)
                .limit(+pageSize);

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error' });
        }
    }

    public async getFriends(req: Request, res: Response, next: NextFunction) {
        const userId = req.query.user_id;

        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.page_size as string) || 10;

            const user = await User.findById(userId)
                .populate('friends', POPULATE_USER)
                .skip((+page - 1) * +pageSize)
                .limit(+pageSize);
            const friends = (user && user.friends) || [];

            res.status(200).json(friends);
        } catch (error) {
            res.status(500).json({ message: 'Error' });
        }
    }
}

export default new UserController();
