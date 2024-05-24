import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),
  email: z.string().email("Invalid email address"),
});
export type Client = z.infer<typeof clientSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name must contain at least 1 character"),
});
export type Category = z.infer<typeof categorySchema>;