import { z } from 'zod';

// Validation schema for event creation
export const createEventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  venueIds: z.string().array().nonempty({
    message: "venueIds Can't be empty!",
  }),
  activityIds: z.string().array().nonempty({
    message: "activityIds Can't be empty!",
  }),
});

// Validation schema for event registration status update
export const updateRegistrationStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'CANCELED',
]);

// Validation schema for event registeration
export const registrationSchema = z.object({
  eventId: z.string().uuid(),
  participantId: z.string().uuid(),
});

// Validation  schema for event updates
export const updateEventSchema = createEventSchema.partial();

// Validation schema for venue creation
export const venueSchema = z.object({
  name: z.string().min(3),
  address: z.string().min(5),
  capacity: z.number().positive(),
});

// Validation schema for activity creation
export const activitySchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

// Validation schema for participant creation
export const participantSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
});
