import { Router } from 'express';
import postRouter from './post.route';

const apiRouter = Router();

apiRouter.use('/posts', postRouter);

export default apiRouter;
