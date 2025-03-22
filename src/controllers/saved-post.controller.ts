import { Request, Response, NextFunction } from 'express';
import SavedPost from '../models/savedpost.model';

class SavedPostController {
    public async getSavedPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.query.user_id;

        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
        }

        try {
            const savedPosts = await SavedPost.findOne({
                userId: userId,
            })
                .populate('posts')
                .sort({ createdAt: -1 });

            res.status(200).json(savedPosts);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export  default new SavedPostController();