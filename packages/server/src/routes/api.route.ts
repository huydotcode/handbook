import { Router } from 'express';
import categoryRouter from './category.route';
import commentRouter from './comment.route';
import conversationRouter from './conversation.route';
import followRouter from './follow.route';
import groupRouter from './group.route';
import itemRouter from './item.route';
import locationRouter from './location.route';
import messageRouter from './message.route';
import notificationRouter from './notification.route';
import postRouter from './post.route';
import requestRouter from './request.route';
import searchRouter from './search.route';
import uploadRouter from './upload.route';
import userRouter from './user.route';

const apiRouter = Router();

apiRouter.use('/posts', postRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/conversations', conversationRouter);
apiRouter.use('/search', searchRouter);
apiRouter.use('/items', itemRouter);
apiRouter.use('/message', messageRouter);
apiRouter.use('/user/follow', followRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/locations', locationRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/requests', requestRouter);
apiRouter.use('/groups', groupRouter);
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/categories', categoryRouter);

export default apiRouter;
