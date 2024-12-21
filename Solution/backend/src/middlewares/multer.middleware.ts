import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { AppError } from '../middlewares/error.middleware';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    return callback(null, true);
  }

  return callback(new AppError('Please upload only image files', 400));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
});

// Wrapper function to handle single image uploads
export const eventImageUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uploadSingle = upload.single('eventImage');

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          new AppError('Image file is too large. Maximum size is 5MB', 400)
        );
      }
      return next(new AppError(err.message, 400));
    } else if (err) {
      return next(new AppError(err.message, 400));
    }
    next();
  });
};
