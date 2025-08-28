import { Router } from 'express';
import MessageController from '../controllers/message.controller';

const messageRouter = Router();

messageRouter.get('/', MessageController.getMessages);
messageRouter.get('/search', MessageController.search);
messageRouter.get('/pinned', MessageController.getPinnedMessages);

export default messageRouter;
