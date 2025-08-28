import { Router } from 'express';
import SearchController from '../controllers/search.controller';

const searchRouter = Router();

searchRouter.get('/', SearchController.search);
searchRouter.get('/users', SearchController.searchUsers);
searchRouter.get('/posts', SearchController.searchPosts);
searchRouter.get('/groups', SearchController.searchGroups);

export default searchRouter;
