import { NextFunction, Request, Response } from 'express';
import prisma from '../config/database.config';
import { AppError } from '../middlewares/error.middleware';
import { registrationSchema } from '../validators/event.validator';

class UserEventsController {
  // Register for an event
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registrationSchema.parse(req.body);

      // Check if event exists and is not full
      const event = await prisma.event.findUnique({
        where: { id: validated.eventId },
        include: {
          venues: true,
          registrations: true,
        },
      });

      if (!event) {
        throw new AppError('Event not found', 404);
      }

      // Check venue capacity
      const totalRegistrations = event.registrations.length;
      const totalCapacity = event.venues.reduce(
        (sum, venue) => sum + venue.capacity,
        0
      );

      if (totalRegistrations >= totalCapacity) {
        throw new AppError('Event is full', 400);
      }

      // Create registration
      const registration = await prisma.registration.create({
        data: {
          eventId: validated.eventId,
          participantId: validated.participantId,
          status: 'PENDING',
        },
        include: {
          event: true,
          participant: true,
        },
      });

      res.status(201).json({
        status: 'okay',
        message: 'Registration successful',
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's registrations
  async viewRegistrations(req: Request, res: Response, next: NextFunction) {
    try {
      const participantId = req.params.participantId;

      const registrations = await prisma.registration.findMany({
        where: { participantId },
        include: {
          event: {
            include: {
              venues: true,
              activities: true,
            },
          },
          participant: true,
        },
        orderBy: {
          registeredAt: 'desc',
        },
      });

      res.status(200).json({
        status: 'okay',
        message: 'Registrations retrieved successfully',
        data: registrations,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all upcoming events with optional filters
  async getUpcomingEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, venueId, activityId } = req.query as {
        startDate?: string;
        endDate?: string;
        venueId?: string;
        activityId?: string;
      };

      // Build the where clause based on filters
      const where: any = {};

      // Filter by date range
      if (startDate) {
        where.startTime = {
          gte: startDate,
        };
      }

      if (endDate) {
        where.endTime = {
          lte: endDate,
        };
      }

      // Get current date string in the same format as your stored dates
      const currentDate = new Date().toISOString();
      where.startTime = {
        ...where.startTime,
        gte: currentDate, // Only show upcoming events
      };

      // Base query
      const eventsQuery = {
        where,
        include: {
          venues: true,
          activities: true,
          registrations: {
            select: {
              status: true,
              _count: true,
            },
          },
        },
        orderBy: {
          startTime: 'asc' as const,
        },
      };

      // If venueId is provided, filter events by venue
      if (venueId) {
        eventsQuery.where = {
          ...eventsQuery.where,
          venues: {
            some: {
              id: venueId,
            },
          },
        };
      }

      // If activityId is provided, filter events by activity
      if (activityId) {
        eventsQuery.where = {
          ...eventsQuery.where,
          activities: {
            some: {
              id: activityId,
            },
          },
        };
      }

      const events = await prisma.event.findMany(eventsQuery);

      // Calculate remaining capacity for each event
      const eventsWithCapacity = events.map((event) => {
        const totalCapacity = event.venues.reduce(
          (sum, venue) => sum + venue.capacity,
          0
        );
        const totalRegistrations = event.registrations.length;
        const remainingCapacity = totalCapacity - totalRegistrations;

        return {
          ...event,
          totalCapacity,
          remainingCapacity,
        };
      });

      res.status(200).json({
        status: 'okay',
        message: 'Events retrieved successfully',
        data: eventsWithCapacity,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserEventsController();
