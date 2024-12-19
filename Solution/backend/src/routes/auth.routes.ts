import { Router } from 'express';
import authController from '../controllers/auth.controller';

const authRouter = Router();

// Register user route
authRouter.post('/register', authController.register);

// Login route
authRouter.post('/login', authController.login);

export default authRouter;
