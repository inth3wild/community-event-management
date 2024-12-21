import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary.config';

// Helper function to upload image to cloudinary
export const uploadEventImage = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'image',
        },
        (error, uploadResult) => {
          if (error) return reject(error);
          return resolve(uploadResult as UploadApiResponse);
        }
      )
      .end(file.buffer);
  });
};

// Helper function to delete uploaded image
export const deleteEventImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error);
  }
};
