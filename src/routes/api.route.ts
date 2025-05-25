import { Router } from 'express';
import postRouter from './post.route';
import commentRouter from './comment.route';
import conversationRouter from './conversation.route';
import searchRouter from './search.route';
import itemRouter from './item.route';
import messageRouter from './message.route';
import savedPostRouter from './saved-post.route';
import userRouter from './user.route';
import locationRouter from './location.route';
import notificationRouter from './notification.route';
import requestRouter from './request.route';
import groupRouter from './group.route';
import uploadRouter from './upload.route';

const apiRouter = Router();

apiRouter.use('/posts', postRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/conversations', conversationRouter);
apiRouter.use('/search', searchRouter);
apiRouter.use('/items', itemRouter);
apiRouter.use('/message', messageRouter);
apiRouter.use('/saved-posts', savedPostRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/locations', locationRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/requests', requestRouter);
apiRouter.use('/groups', groupRouter);
apiRouter.use('/upload', uploadRouter);

export default apiRouter;
