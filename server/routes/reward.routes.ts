import { Elysia, t } from "elysia"
import { authMiddleware } from "../middleware/auth.middleware"
import {
  getUserRewards,
  createReward,
  updateReward,
  deleteReward,
  redeemReward,
} from "../services/reward.service"

export const rewardRoutes = new Elysia({ prefix: "/api/rewards" })
  .use(authMiddleware)
  .onBeforeHandle(({ user, set }) => {
    if (!user) {
      set.status = 401
      return { error: "Unauthorized" }
    }
  })
  .get("/", async ({ user }) => {
    const rewardList = await getUserRewards(user!.id)
    return rewardList
  })
  .post(
    "/",
    async ({ user, body }) => {
      const reward = await createReward(user!.id, {
        title: body.title,
        emoji: body.emoji ?? "🏆",
        description: body.description ?? null,
        xpRequired: body.xpRequired,
      })
      return reward
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1, maxLength: 100 }),
        description: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
        emoji: t.Optional(t.String()),
        xpRequired: t.Number({ minimum: 1 }),
      }),
    }
  )
  .patch(
    "/:id",
    async ({ user, params, body, set }) => {
      const updated = await updateReward(user!.id, params.id, body)
      if (!updated) {
        set.status = 404
        return { error: "Reward not found" }
      }
      return updated
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
        description: t.Optional(t.Nullable(t.String({ maxLength: 500 }))),
        emoji: t.Optional(t.String()),
        xpRequired: t.Optional(t.Number({ minimum: 1 })),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ user, params, set }) => {
      const deleted = await deleteReward(user!.id, params.id)
      if (!deleted) {
        set.status = 404
        return { error: "Reward not found" }
      }
      return { success: true }
    },
    {
      params: t.Object({ id: t.String() }),
    }
  )
  .post(
    "/:id/redeem",
    async ({ user, params, set }) => {
      const result = await redeemReward(user!.id, params.id)
      if (!result) {
        set.status = 400
        return { error: "Reward not found or already redeemed" }
      }
      return result
    },
    {
      params: t.Object({ id: t.String() }),
    }
  )
