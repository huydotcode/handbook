import { Router } from 'express';
import conversationController from '../controllers/conversation.controller';

const conversationRouter = Router();

conversationRouter.get('/', conversationController.getConversations);
conversationRouter.get('/:id', conversationController.getConversationById);

export default conversationRouter;
