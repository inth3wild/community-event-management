import { NextFunction, Request, Response } from 'express';
import prisma from '../config/database.config';
import { AppError } from '../middlewares/error.middleware';
import { deleteEventImage, uploadEventImage } from '../utils/cloudinary.utils';
import {
  createEventSchema,
  updateEventSchema,
} from '../validators/event.validator';

class AdminEventsController {
  // Create a new event
  async createEvent(req: Request, res: Response, next: NextFunction) {
    let uploadedImage: any = null;

    try {
      // Parse and preprocess form fields
      const {
        venueIds: venuesStringArray,
        activityIds: activitiesStringArray,
        startTime,
        endTime,
        name,
        description,
      } = req.body;

      const normalizedData = {
        name,
        description,
        startTime,
        endTime,
        venueIds: JSON.parse(venuesStringArray), // Convert string to array
        activityIds: JSON.parse(activitiesStringArray), // Convert string to array
      };

      // Validate input
      const validatedData = createEventSchema.parse(normalizedData);

      // Check if end time is after start time
      if (
        new Date(validatedData.endTime) <= new Date(validatedData.startTime)
      ) {
        throw new AppError('End time must be after start time', 400);
      }

      // Destructure the IDs arrays from other event data
      const { venueIds, activityIds, ...eventData } = validatedData;

      // Verify venues exist
      const venues = await prisma.venue.findMany({
        where: { id: { in: venueIds } },
      });
      if (venues.length !== venueIds.length) {
        throw new AppError('One or more venue IDs are invalid', 400);
      }

      // Verify activities exist
      const activities = await prisma.activity.findMany({
        where: { id: { in: activityIds } },
      });
      if (activities.length !== activityIds.length) {
        throw new AppError('One or more activity IDs are invalid', 400);
      }

      // Handle image upload if present
      if (req.file) {
        uploadedImage = await uploadEventImage(req.file);
      }

      // Create event in database
      const event = await prisma.event.create({
        data: {
          ...eventData,
          imageUrl: uploadedImage?.secure_url || null,
          imageId: uploadedImage?.public_id || null,
          venues: {
            connect: venueIds.map((id) => ({ id })),
          },
          activities: {
            connect: activityIds.map((id) => ({ id })),
          },
        },
        include: {
          venues: true,
          activities: true,
        },
      });

      res.status(201).json({
        status: 'okay',
        message: 'Event created successfully',
        data: event,
      });
    } catch (error) {
      // If upload succeeded but database operation failed, cleanup the uploaded image
      if (uploadedImage?.public_id) {
        await deleteEventImage(uploadedImage.public_id);
      }
      next(error);
    }
  }

  //   Get specific event
  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          venues: true,
          activities: true,
          registrations: {
            include: {
              participant: true,
            },
          },
        },
      });

      if (!event) {
        throw new AppError('Event not found', 404);
      }

      res.status(200).json({
        status: 'okay',
        message: 'Event retrieved successfully',
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

  // Update an event
  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const validatedData = updateEventSchema.parse(req.body);
      const { venueIds, activityIds, ...eventData } = validatedData;

      // Check if event exists
      const existingEvent = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!existingEvent) {
        throw new AppError('Event not found', 404);
      }

      // Verify venues if provided
      if (venueIds) {
        const venues = await prisma.venue.findMany({
          where: { id: { in: venueIds } },
        });
        if (venues.length !== venueIds.length) {
          throw new AppError('One or more venue IDs are invalid', 400);
        }
      }

      // Verify activities if provided
      if (activityIds) {
        const activities = await prisma.activity.findMany({
          where: { id: { in: activityIds } },
        });
        if (activities.length !== activityIds.length) {
          throw new AppError('One or more activity IDs are invalid', 400);
        }
      }

      // Update event
      const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: {
          ...eventData,
          ...(venueIds && {
            venues: {
              set: venueIds.map((id) => ({ id })),
            },
          }),
          ...(activityIds && {
            activities: {
              set: activityIds.map((id) => ({ id })),
            },
          }),
        },
        include: {
          venues: true,
          activities: true,
        },
      });

      res.status(200).json({
        status: 'okay',
        message: 'Event updated successfully',
        data: updatedEvent,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete an event
  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      // Check if event exists
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new AppError('Event not found', 404);
      }

      // Delete all registrations first (due to foreign key constraints)
      await prisma.registration.deleteMany({
        where: { eventId },
      });

      // Delete the event
      await prisma.event.delete({
        where: { id: eventId },
      });

      res.status(200).json({
        status: 'okay',
        message: 'Event deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Participant Management
  async getAllParticipants(req: Request, res: Response, next: NextFunction) {
    try {
      const participants = await prisma.participant.findMany({
        include: {
          registrations: {
            include: {
              event: true,
            },
          },
        },
      });

      res.status(200).json({
        status: 'okay',
        message: 'Participants retrieved successfully',
        data: participants,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminEventsController();
