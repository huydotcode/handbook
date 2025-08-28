import { Router } from 'express';
import userController from '../controllers/user.controller';
import adminMiddleware from '../middlewares/admin.middleware';

const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/friends', userController.getFriends);

export default userRouter;
