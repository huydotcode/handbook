import { Router } from 'express';
import notificationController from '../controllers/notification.controller';

const notificationRouter = Router();

notificationRouter.get("/", notificationController.getNotifications);

export default notificationRouter;