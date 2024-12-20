import { Router } from 'express';
import venueController from '../controllers/venue.controller';

const venueRouter = Router();

// Create venue route
venueRouter.post('/create', venueController.createVenue);

// Update venue route
venueRouter.patch('/update/:venueId', venueController.updateVenue);

export default venueRouter;
