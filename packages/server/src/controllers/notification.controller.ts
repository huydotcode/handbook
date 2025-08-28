import { NextFunction, Request, Response } from 'express';
import Notification from '../models/notification.model';
import { POPULATE_USER } from '../utils/populate';

class NotificationController {
    public async getNotifications(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.query.user_id as string;
            const page = parseInt(req.query.page as string);
            const pageSize = parseInt(req.query.pageSize as string);

            const notifications = await Notification.find({
                receiver: userId,
                isDeleted: false,
            })
                .sort({ createdAt: -1, isRead: 1 })
                .skip((+page - 1) * +pageSize)
                .limit(+pageSize)
                .populate('sender', POPULATE_USER)
                .populate('receiver', POPULATE_USER);

            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching notifications' });
        }
    }
}

export default new NotificationController();
