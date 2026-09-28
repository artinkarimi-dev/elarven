import { z } from 'zod';
export const contactSchema = z.object({
  firstName: z.string().trim().min(2, 'Enter your first name (at least 2 letters).').max(80),
  lastName: z.string().trim().min(2, 'Enter your last name (at least 2 letters).').max(80),
  email: z.email('Enter a valid email address.').max(160),
  accepted: z.literal(true, { error: 'Please accept the cancellation policy to continue.' }),
});
export type Contact = { firstName: string; lastName: string; email: string; accepted: boolean };
