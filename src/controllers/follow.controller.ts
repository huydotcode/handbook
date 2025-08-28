import { NextFunction, Request, Response } from 'express';
import Follows from '../models/follow.model';
import { POPULATE_USER } from '../utils/populate';

class FollowController {
    public async getFollowings(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.params.user_id || req.query.user_id;

            if (!userId) {
                res.status(400).json({
                    message: 'User ID is required',
                });
                return;
            }

            const followings = await Follows.find({ follower: userId })
                .populate('follower', POPULATE_USER)
                .populate('following', POPULATE_USER)
                .exec();

            res.status(200).json(followings);
        } catch (error) {
            next(error);
        }
    }
}

export default new FollowController();
