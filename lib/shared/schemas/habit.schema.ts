import { z } from "zod"

export const createHabitSchema = z.object({
  name: z.string().min(1).max(100),
  emoji: z.string().default("⭐"),
  repeat: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  selectedDays: z.array(z.boolean()).length(7).default([true, true, true, true, true, true, true]),
  remindMe: z.boolean().default(false),
  reminderTime: z.string().nullable().default(null),
  xpPerCheck: z.number().int().min(1).max(100).default(10),
  isPublic: z.boolean().default(true),
})

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  emoji: z.string().optional(),
  repeat: z.enum(["daily", "weekly", "monthly"]).optional(),
  selectedDays: z.array(z.boolean()).length(7).optional(),
  remindMe: z.boolean().optional(),
  reminderTime: z.string().nullable().optional(),
  xpPerCheck: z.number().int().min(1).max(100).optional(),
  isPublic: z.boolean().optional(),
})

export const toggleHabitSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
})
