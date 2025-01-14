import postController from '../controllers/post.controller';
import { Router } from 'express';

const postRouter = Router();

postRouter.get('/', postController.getAllPosts);
postRouter.get('/new-feed', postController.getNewFeedPosts);
postRouter.get('/:id', postController.getPostById);

export default postRouter;
