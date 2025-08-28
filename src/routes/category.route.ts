import { Router } from 'express';
import categoryController from '../controllers/category.controller';

const categoryRouter = Router();

categoryRouter.get('/', categoryController.getCategories);
categoryRouter.get('/:slug', categoryController.getCategoryBySlug);

export default categoryRouter;
