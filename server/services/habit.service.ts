import { eq, and, inArray } from "drizzle-orm"
import { db } from "../db"
import { habits, habitCompletions } from "../db/schema"
import type { z } from "zod"
import type { createHabitSchema, updateHabitSchema } from "@/lib/shared/schemas/habit.schema"

type CreateHabitInput = z.infer<typeof createHabitSchema>
type UpdateHabitInput = z.infer<typeof updateHabitSchema>

type HabitRow = typeof habits.$inferSelect

function habitToResponse(habit: HabitRow, activities: Record<string, boolean> = {}) {
  return {
    id: habit.id,
    name: habit.name,
    emoji: habit.emoji,
    repeat: habit.repeat,
    selectedDays: habit.selectedDays,
    remindMe: habit.remindMe,
    reminderTime: habit.reminderTime,
    xpPerCheck: Number(habit.xpPerCheck),
    isPublic: habit.isPublic,
    createdAt: habit.createdAt.toISOString(),
    activities,
  }
}

async function getActivitiesByHabitIds(
  habitIds: string[]
): Promise<Record<string, Record<string, boolean>>> {
  if (habitIds.length === 0) return {}
  const allCompletions = await db
    .select()
    .from(habitCompletions)
    .where(inArray(habitCompletions.habitId, habitIds))
  return allCompletions.reduce<Record<string, Record<string, boolean>>>(
    (acc, c) => ({
      ...acc,
      [c.habitId]: { ...acc[c.habitId], [c.date]: c.completed },
    }),
    {}
  )
}

export async function getUserHabits(userId: string) {
  const userHabits = await db.select().from(habits).where(eq(habits.userId, userId))

  if (userHabits.length === 0) return []

  const byHabit = await getActivitiesByHabitIds(userHabits.map((h) => h.id))
  return userHabits.map((h) => habitToResponse(h, byHabit[h.id] ?? {}))
}

export async function createHabit(userId: string, input: CreateHabitInput) {
  const [habit] = await db
    .insert(habits)
    .values({
      userId,
      name: input.name,
      emoji: input.emoji,
      repeat: input.repeat,
      selectedDays: input.selectedDays,
      remindMe: input.remindMe,
      reminderTime: input.reminderTime,
      xpPerCheck: String(input.xpPerCheck),
      isPublic: input.isPublic,
    })
    .returning()

  return habitToResponse(habit)
}

export async function updateHabit(userId: string, habitId: string, input: UpdateHabitInput) {
  const [existing] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))

  if (!existing) return null

  const [updated] = await db
    .update(habits)
    .set({
      ...input,
      xpPerCheck: input.xpPerCheck != null ? String(input.xpPerCheck) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(habits.id, habitId))
    .returning()

  return updated
}

export async function deleteHabit(userId: string, habitId: string) {
  const [existing] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))

  if (!existing) return false

  await db.delete(habits).where(eq(habits.id, habitId))
  return true
}

export async function toggleHabitCompletion(userId: string, habitId: string, date: string) {
  // Verify habit belongs to user
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))

  if (!habit) return null

  // Check if completion exists
  const [existing] = await db
    .select()
    .from(habitCompletions)
    .where(and(eq(habitCompletions.habitId, habitId), eq(habitCompletions.date, date)))

  if (existing) {
    if (existing.completed) {
      // Toggle off: delete the completion
      await db.delete(habitCompletions).where(eq(habitCompletions.id, existing.id))
      return { date, completed: false }
    } else {
      // Toggle on
      await db
        .update(habitCompletions)
        .set({ completed: true })
        .where(eq(habitCompletions.id, existing.id))
      return { date, completed: true }
    }
  } else {
    // Create new completion
    await db.insert(habitCompletions).values({
      habitId,
      date,
      completed: true,
    })
    return { date, completed: true }
  }
}

export async function getPublicHabits(userId: string) {
  const userHabits = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.isPublic, true)))

  if (userHabits.length === 0) return []

  const byHabit = await getActivitiesByHabitIds(userHabits.map((h) => h.id))
  return userHabits.map((h) => habitToResponse(h, byHabit[h.id] ?? {}))
}
