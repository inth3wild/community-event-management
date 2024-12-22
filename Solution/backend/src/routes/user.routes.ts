import { Router } from 'express';
import adminEventsController from '../controllers/admin-events.controller';
import userEventsController from '../controllers/user-events.controller';

const userRouter = Router();

// Get all events route
userRouter.get('/', adminEventsController.getAllEvents);

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
