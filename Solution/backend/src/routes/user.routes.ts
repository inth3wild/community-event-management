import { Router } from 'express';
import userEventsController from '../controllers/user-events.controller';

const userRouter = Router();

// Register for event route
userRouter.post('/register', userEventsController.register);

// View user's registrations route
userRouter.get(
  '/registrations/:participantId',
  userEventsController.viewRegistrations
);

// Get upcoming events
userRouter.get('/upcoming', userEventsController.getUpcomingEvents);

export default userRouter;
