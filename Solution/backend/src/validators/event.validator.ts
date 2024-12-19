import { z } from 'zod';

// Zod validation schema for event creation
export const createEventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});
