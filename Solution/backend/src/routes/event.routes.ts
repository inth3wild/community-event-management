import { Router } from 'express';
import eventController from '../controllers/events.controller';

const eventRouter = Router();

// Get all events route
eventRouter.get('/', eventController.getAllEvents);

// Create event route
eventRouter.post('/create', eventController.createEvent);

export default eventRouter;
