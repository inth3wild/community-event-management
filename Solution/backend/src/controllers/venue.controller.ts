import { NextFunction, Request, Response } from 'express';
import prisma from '../config/database.config';
import { venueSchema } from '../validators/event.validator';

class VenueController {
  // Venue Management
  async createVenue(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = venueSchema.parse(req.body);

      const venue = await prisma.venue.create({
        data: validatedData,
      });

      res.status(201).json({
        status: 'okay',
        message: 'Venue created successfully',
        data: venue,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVenue(req: Request, res: Response, next: NextFunction) {
    try {
      const { venueId } = req.params;
      const validatedData = venueSchema.partial().parse(req.body);

      const venue = await prisma.venue.update({
        where: { id: venueId },
        data: validatedData,
      });

      res.status(200).json({
        status: 'okay',
        message: 'Venue updated successfully',
        data: venue,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new VenueController();
