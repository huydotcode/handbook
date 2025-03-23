import { NextFunction, Request, Response } from 'express';
import Item from '../models/item.model';
import { POPULATE_USER } from '../utils/populate';

class ItemController {
    // ROUTE: GET /items
    public async getAllItems(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const page_size = parseInt(req.query.page_size as string) || 10;

            const items = await Item.find({})
                .skip((+page - 1) * +page_size)
                .limit(+page_size)
                .sort({ createdAt: -1 })
                .populate('category')
                .populate('location')
                .populate('seller', POPULATE_USER)
                .populate('images');

            res.status(200).json(items);
        } catch (error) {
            next(error);
        }
    }
}

export default new ItemController();