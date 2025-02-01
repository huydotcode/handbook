import { Router } from 'express';
import postRouter from './post.route';
import commentRouter from './comment.route';
import conversationRouter from './conversation.route';

const apiRouter = Router();

apiRouter.use('/posts', postRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/conversations', conversationRouter);

export default apiRouter;
