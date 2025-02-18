import postController from '../controllers/post.controller';
import { Router } from 'express';

const postRouter = Router();

postRouter.get('/', postController.getAllPosts);
postRouter.get('/new-feed', postController.getNewFeedPosts);
postRouter.get('/new-feed-group', postController.getNewFeedGroupPosts);
postRouter.get('/profile/:user_id', postController.getProfilePosts);
postRouter.get('/group/:group_id', postController.getGroupPosts);
postRouter.get('/group/:group_id/manage', postController.getManageGroupPosts);
postRouter.get('/:id', postController.getPostById);

export default postRouter;
