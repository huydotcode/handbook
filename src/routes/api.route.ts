import { Router } from 'express';
import postRouter from './post.route';
import commentRouter from './comment.route';
import conversationRouter from './conversation.route';
import searchRouter from './search.route';

const apiRouter = Router();

apiRouter.use('/posts', postRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/conversations', conversationRouter);
apiRouter.use('/search', searchRouter);

export default apiRouter;
