import { Elysia, t } from "elysia"
import { authMiddleware } from "../middleware/auth.middleware"
import {
  getUserHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
} from "../services/habit.service"

export const habitRoutes = new Elysia({ prefix: "/api/habits" })
  .use(authMiddleware)
  .onBeforeHandle(({ user, set }) => {
    if (!user) {
      set.status = 401
      return { error: "Unauthorized" }
    }
  })
  .get("/", async ({ user }) => {
    const habits = await getUserHabits(user!.id)
    return habits
  })
  .post(
    "/",
    async ({ user, body }) => {
      const habit = await createHabit(user!.id, {
        name: body.name,
        emoji: body.emoji ?? "⭐",
        repeat: body.repeat ?? "daily",
        selectedDays: body.selectedDays ?? [true, true, true, true, true, true, true],
        remindMe: body.remindMe ?? false,
        reminderTime: body.reminderTime || null,
        xpPerCheck: body.xpPerCheck ?? 10,
        isPublic: body.isPublic ?? true,
      })
      return habit
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        emoji: t.Optional(t.String()),
        repeat: t.Optional(
          t.Union([t.Literal("daily"), t.Literal("weekly"), t.Literal("monthly")])
        ),
        selectedDays: t.Optional(t.Array(t.Boolean())),
        remindMe: t.Optional(t.Boolean()),
        reminderTime: t.Optional(t.String()),
        xpPerCheck: t.Optional(t.Number()),
        isPublic: t.Optional(t.Boolean()),
      }),
    }
  )
  .patch(
    "/:id",
    async ({ user, params, body, set }) => {
      const updated = await updateHabit(user!.id, params.id, body)
      if (!updated) {
        set.status = 404
        return { error: "Habit not found" }
      }
      return updated
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
        emoji: t.Optional(t.String()),
        repeat: t.Optional(
          t.Union([t.Literal("daily"), t.Literal("weekly"), t.Literal("monthly")])
        ),
        selectedDays: t.Optional(t.Array(t.Boolean())),
        remindMe: t.Optional(t.Boolean()),
        reminderTime: t.Optional(t.String()),
        xpPerCheck: t.Optional(t.Number()),
        isPublic: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ user, params, set }) => {
      const deleted = await deleteHabit(user!.id, params.id)
      if (!deleted) {
        set.status = 404
        return { error: "Habit not found" }
      }
      return { success: true }
    },
    {
      params: t.Object({ id: t.String() }),
    }
  )
  .post(
    "/:id/toggle",
    async ({ user, params, body, set }) => {
      const result = await toggleHabitCompletion(user!.id, params.id, body.date)
      if (!result) {
        set.status = 404
        return { error: "Habit not found" }
      }
      return result
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        date: t.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" }),
      }),
    }
  )
