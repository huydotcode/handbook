import { Router } from 'express';
import followController from '../controllers/follow.controller';

const followRouter = Router();

followRouter.get('/followings', followController.getFollowings);

export default followRouter;
