import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../config/app.config';
import prisma from '../config/database.config';
import { AppError } from '../middlewares/error.middleware';
import { LoginSchema, RegisterSchema } from '../validators/auth.validator';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = RegisterSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(validated.password, 10);

      // Check for existing user
      const existingUser = await prisma.user.findUnique({
        where: {
          email: validated.email,
        },
      });
      console.log(existingUser);
      if (existingUser) {
        throw new AppError('Cannot create user with that email', 400);
      }

      const user = await prisma.user.create({
        data: {
          name: validated.name,
          email: validated.email,
          password: hashedPassword,
        },
        omit: {
          password: true,
        },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        environment.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        status: 'okay',
        message: 'User registered successfully',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = LoginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: validated.email },
      });

      if (!user || !(await bcrypt.compare(validated.password, user.password))) {
        throw new AppError('Invalid credentials', 401);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        environment.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      const { password, ...userWithoutPassword } = user;

      res.status(200).json({
        status: 'okay',
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
