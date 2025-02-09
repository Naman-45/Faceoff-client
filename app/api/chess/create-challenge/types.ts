import { z } from 'zod';

export const createChallengeSchema = z.object({
    username: z.string().min(3, 'Username cannot be less than 3 characeters')
    .max(25, 'Username cannot be more than 25 characters.'),
    amount: z.number(),
    phoneNumber: z.string().regex(
        /^\d{10}$/,
        "Phone number must be exactly 10 digits"
    ).optional(),
    challengeType: z.enum(['Public', 'Private'])  
})

export type createChallengeType = z.infer<typeof createChallengeSchema>;