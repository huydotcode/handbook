import { NextFunction, Request, Response } from 'express';
import Category from '../models/category.model';

class CategoryController {
    // ROUTE / GET /categories
    public async getCategories(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.page_size as string) || 100;

            const categories = await Category.find({})
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .sort({ createdAt: -1 });

            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    // ROUTE GET /categories/:slug
    public async getCategoryBySlug(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { slug } = req.params;

            const category = await Category.findOne({ slug });

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    }
}

export default new CategoryController();
