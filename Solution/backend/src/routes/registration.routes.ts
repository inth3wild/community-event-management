import { Router } from 'express';
import registrationController from '../controllers/registration.controller';

const registrationRouter = Router();

// Get all events route
registrationRouter.get('/', registrationController.getAllRegistrations);

// Update registration status route
registrationRouter.put(
  '/:registrationId',
  registrationController.updateRegistrationStatus
);

export default registrationRouter;
