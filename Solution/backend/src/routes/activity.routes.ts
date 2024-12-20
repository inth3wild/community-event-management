import { Router } from 'express';
import activityController from '../controllers/activity.controller';

const activityRouter = Router();

// Create activity route
activityRouter.post('/create', activityController.createActivity);

// Update activity route
activityRouter.patch('/update/:activityId', activityController.updateActivity);

export default activityRouter;
