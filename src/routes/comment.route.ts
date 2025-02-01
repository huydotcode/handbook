import { Router } from 'express';
import commentController from '../controllers/comment.controller';

const commentRouter = Router();

commentRouter.get('/', commentController.getCommentsByPost);

export default commentRouter;
