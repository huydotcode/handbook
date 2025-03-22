import { Router } from 'express';
import itemController from '../controllers/item.controller';

const itemRouter = Router();

itemRouter.get("/", itemController.getAllItems);

export default itemRouter;