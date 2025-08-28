import { Router } from 'express';
import GroupController from '../controllers/group.controller';

const groupRouter = Router();
groupRouter.get("/joined", GroupController.getJoinedGroups);
groupRouter.get("/:id", GroupController.getGroupByGroupId);


export default groupRouter;