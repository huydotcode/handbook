import postController from '../controllers/post.controller';
import { Router } from 'express';

const postRouter = Router();

postRouter.get('/', postController.getAllPosts);
postRouter.post('/', postController.createPost);
postRouter.get('/new-feed', postController.getNewFeedPosts);
postRouter.get('/new-feed-group', postController.getNewFeedGroupPosts);
postRouter.get('/new-feed-friend', postController.getNewFeedFriendPosts);
postRouter.get('/saved', postController.getSavedPosts);
postRouter.get('/profile/:user_id', postController.getProfilePosts);
postRouter.get('/group/member', postController.getPostByMember);
postRouter.get('/group/manage/:group_id', postController.getManageGroupPosts);
postRouter.get(
    '/group/manage/pending/:group_id',
    postController.getManageGroupPostsPending
);
postRouter.get('/group/:group_id', postController.getGroupPosts);
postRouter.get('/:id', postController.getPostById);

export default postRouter;
