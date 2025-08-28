import { Router } from 'express';
import LocationController from '../controllers/location.controller';

const locationRouter = Router();

locationRouter.get("/", LocationController.getLocations);

export default locationRouter;