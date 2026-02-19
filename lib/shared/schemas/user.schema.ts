import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, dashes and underscores")
    .optional(),
  image: z.string().nullable().optional(),
})
