import { Router } from 'express';
import SavedPostController from '../controllers/saved-post.controller';

const savedPostRouter = Router()

savedPostRouter.get("/", SavedPostController.getSavedPosts);

export default savedPostRouter;