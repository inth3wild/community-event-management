import { NextFunction, Request, Response } from 'express';
import prisma from '../config/database.config';
import { AppError } from '../middlewares/error.middleware';
import { createEventSchema } from '../validators/event.validator';

class EventController {
  // Create a new event
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const validatedData = createEventSchema.parse(req.body);

      // Check if end time is after start time
      if (
        new Date(validatedData.endTime) <= new Date(validatedData.startTime)
      ) {
        throw new AppError('End time must be after start time', 400);
      }

      // Create event in database
      const event = await prisma.event.create({
        data: validatedData,
      });

      res.status(201).json({
        status: 'okay',
        message: 'Event created successfully',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all events
  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      // Optional filtering
      const { startDate, endDate, page = 1, limit = 10 } = req.query;

      const where: any = {};

      // Optional date filtering
      if (startDate && endDate) {
        where.startTime = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      const events = await prisma.event.findMany({
        where,
        include: {
          venues: true,
          activities: true,
          registrations: true,
        },
        skip: ((page as number) - 1) * (limit as number),
        take: Number(limit),
      });

      res.status(200).json({
        status: 'okay',
        message: 'Events retrieved successfully',
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  // Other methods: updateEvent, deleteEvent, getEventById
}

export default new EventController();
