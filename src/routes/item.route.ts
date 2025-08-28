import { Router } from 'express';
import itemController from '../controllers/item.controller';

const itemRouter = Router();

itemRouter.get('/', itemController.getAllItems);
itemRouter.get('/seller/:sellerId', itemController.getItemsBySeller);
itemRouter.get('/search', itemController.searchItems);

export default itemRouter;
