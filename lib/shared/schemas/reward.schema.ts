import { z } from "zod"

export const createRewardSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).nullable().default(null),
  emoji: z.string().default("🏆"),
  xpRequired: z.number().int().min(1),
})

export const updateRewardSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  emoji: z.string().optional(),
  xpRequired: z.number().int().min(1).optional(),
})
