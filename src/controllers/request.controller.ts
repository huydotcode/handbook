import { Request, Response, NextFunction } from 'express';
import { POPULATE_USER } from '../utils/populate';
import Notification from '../models/notification.model';

class RequestController {
    public async getRequests(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.query.user_id as string;
            const page = parseInt(req.query.page as string);
            const pageSize = parseInt(req.query.pageSize as string);

            const requests = await Notification.find({
                sender: userId,
            })
                .sort({ createdAt: -1 })
                .skip((+page - 1) * +pageSize)
                .limit(+pageSize)
                .populate('sender', POPULATE_USER)
                .populate('receiver', POPULATE_USER);

            res.status(200).json(requests);
        } catch (error) {
            res.status(500).json({ message: "Error fetching requests" });
        }
    }
}

export default new RequestController();