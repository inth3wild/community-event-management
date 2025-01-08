import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { environment } from './config/app.config';

// Import route modules
import activityRouter from '@/routes/activity.routes';
import adminRouter from './routes/admin.routes';
import authRouter from './routes/auth.routes';
import registrationRouter from './routes/registration.routes';
import userRouter from './routes/user.routes';
import venueRouter from './routes/venue.routes';

// Import error handling middleware
import { errorHandler } from './middlewares/error.middleware';

// Import auth middlewares
import { authenticateToken, requireAdmin } from './middlewares/auth.middleware';

const app = express();
const PORT = environment.PORT;

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('tiny'));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'okay',
    message: 'Welcome to the Community Event Management API',
  });
});
app.use('/api/auth', authRouter);
app.use('/api/user/events', authenticateToken, userRouter);
app.use('/api/venues', authenticateToken, venueRouter);
app.use('/api/activities', authenticateToken, activityRouter);
app.use('/api/admin/events', authenticateToken, requireAdmin, adminRouter);
app.use(
  '/api/admin/registrations',
  authenticateToken,
  requireAdmin,
  registrationRouter
);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});

export default app;
