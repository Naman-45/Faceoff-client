import { z } from 'zod';

export const joinChallengeSchema = z.object({
    username: z.string().min(3, 'Username cannot be less than 3 characeters')
    .max(25, 'Username cannot be more than 25 characters.'),
    phoneNumber: z.string().regex(
        /^\d{10}$/,
        "Phone number must be exactly 10 digits"
    ),
})

export type joinChallengeType = z.infer<typeof joinChallengeSchema>;