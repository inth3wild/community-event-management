import { Router } from 'express';
import adminEventsController from '../controllers/admin-events.controller';
import { eventImageUpload } from '../middlewares/multer.middleware';

const adminRouter = Router();

// Get all events route
adminRouter.get('/', adminEventsController.getAllEvents);

// Get all participants
adminRouter.get('/participants', adminEventsController.getAllParticipants);

// Get specific event route
adminRouter.get('/:eventId', adminEventsController.getEvent);

// Create event route
adminRouter.post(
  '/create',
  eventImageUpload,
  adminEventsController.createEvent
);

// Update event route
adminRouter.patch(
  '/update/:eventId',
  eventImageUpload,
  adminEventsController.updateEvent
);

// Delete event route
adminRouter.delete('/delete/:eventId', adminEventsController.deleteEvent);

export default adminRouter;
