import { Router } from 'express';
import conversationController from '../controllers/conversation.controller';

const conversationRouter = Router();

conversationRouter.get('/', conversationController.getConversations);

export default conversationRouter;
