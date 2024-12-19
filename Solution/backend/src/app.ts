import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { environment } from './config/app.config';

// Import route modules
import activityRouter from './routes/activity.routes';
import authRouter from './routes/auth.routes';
import eventRouter from './routes/event.routes';
import participantRouter from './routes/participant.routes';
import venueRouter from './routes/venue.routes';

// Import error handling middleware
import { errorHandler } from './middlewares/error.middleware';

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
    data: null,
  });
});
app.use('/api/events', eventRouter);
app.use('/api/participants', participantRouter);
app.use('/api/venues', venueRouter);
app.use('/api/activities', activityRouter);
app.use('/api/auth', authRouter);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});

export default app;
