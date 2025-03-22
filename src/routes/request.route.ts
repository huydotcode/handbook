import { Router } from 'express';
import requestController from '../controllers/request.controller';

const requestRouter = Router();

requestRouter.get("/", requestController.getRequests)

export default requestRouter;