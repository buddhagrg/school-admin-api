import { z } from 'zod';

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
  })
});
