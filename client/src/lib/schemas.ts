import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email({ message: 'A valid email is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;