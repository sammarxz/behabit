import { Elysia, t } from "elysia"
import { authMiddleware } from "../middleware/auth.middleware"
import {
  getProfile,
  updateProfile,
  checkUsernameAvailability,
  getPublicProfile,
  deleteAccount,
} from "../services/user.service"
import { getPublicHabits } from "../services/habit.service"

export const userRoutes = new Elysia()
  // Authenticated profile routes
  .group("/api/profile", (app) =>
    app
      .use(authMiddleware)
      .onBeforeHandle(({ user, set }) => {
        if (!user) {
          set.status = 401
          return { error: "Unauthorized" }
        }
      })
      .get("/", async ({ user }) => {
        const profile = await getProfile(user!.id)
        return profile
      })
      .get(
        "/check-username",
        async ({ user, query }) => {
          const { username } = query
          if (!username || username.length < 3) return { available: false }
          return checkUsernameAvailability(user!.id, username)
        },
        {
          query: t.Object({ username: t.String() }),
        }
      )
      .delete("/", async ({ user }) => {
        await deleteAccount(user!.id)
        return { success: true }
      })
      .patch(
        "/",
        async ({ user, body, set }) => {
          const result = await updateProfile(user!.id, body)
          if (result && "error" in result) {
            set.status = 400
            return { error: result.error }
          }
          return result
        },
        {
          body: t.Object({
            name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
            username: t.Optional(t.String({ minLength: 3, maxLength: 30 })),
            image: t.Optional(t.Union([t.String({ maxLength: 500_000 }), t.Null()])),
          }),
        }
      )
  )
  // Public profile route
  .get(
    "/api/users/:username",
    async ({ params, set }) => {
      const profile = await getPublicProfile(params.username)
      if (!profile) {
        set.status = 404
        return { error: "User not found" }
      }
      const habits = await getPublicHabits(profile.id)
      return { profile, habits }
    },
    {
      params: t.Object({ username: t.String() }),
    }
  )
