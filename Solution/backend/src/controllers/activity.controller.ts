import { NextFunction, Request, Response } from 'express';
import prisma from '../config/database.config';
import { activitySchema } from '../validators/event.validator';

class ActivityController {
  // Activity Management
  async createActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = activitySchema.parse(req.body);

      const activity = await prisma.activity.create({
        data: validatedData,
      });

      res.status(201).json({
        status: 'okay',
        message: 'Activity created successfully',
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { activityId } = req.params;
      const validatedData = activitySchema.partial().parse(req.body);

      const activity = await prisma.activity.update({
        where: { id: activityId },
        data: validatedData,
      });

      res.status(201).json({
        status: 'okay',
        message: 'Activity updated successfully',
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all activities
  async getAllActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const activities = await prisma.activity.findMany({
        include: {
          events: true,
        },
      });

      res.status(200).json({
        status: 'okay',
        message: 'Activities retrieved successfully',
        data: activities,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ActivityController();
