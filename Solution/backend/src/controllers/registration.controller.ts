import { NextFunction, Request, Response } from 'express';
import prisma from '../config/database.config';
import { updateRegistrationStatusSchema } from '../validators/event.validator';

class RegistrationController {
  // Manage registration status
  async updateRegistrationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { registrationId } = req.params;
      const { status } = req.body;

      //   Validate input
      const validatedData = updateRegistrationStatusSchema.parse(status);

      const registration = await prisma.registration.update({
        where: { id: registrationId },
        data: { status: validatedData },
        include: {
          event: true,
          participant: true,
        },
      });

      res.json({
        status: 'okay',
        message: 'Registration updated successfully',
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RegistrationController();
