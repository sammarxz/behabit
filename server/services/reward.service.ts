import { eq, and, asc } from "drizzle-orm"
import { db } from "../db"
import { rewards } from "../db/schema"
import type { z } from "zod"
import type { createRewardSchema, updateRewardSchema } from "@/lib/shared/schemas/reward.schema"

type CreateRewardInput = z.infer<typeof createRewardSchema>
type UpdateRewardInput = z.infer<typeof updateRewardSchema>

type RewardRow = typeof rewards.$inferSelect

function rewardToResponse(reward: RewardRow) {
  return {
    id: reward.id,
    title: reward.title,
    description: reward.description,
    emoji: reward.emoji,
    xpRequired: reward.xpRequired,
    isRedeemed: reward.isRedeemed,
    redeemedAt: reward.redeemedAt?.toISOString() ?? null,
    createdAt: reward.createdAt.toISOString(),
    updatedAt: reward.updatedAt.toISOString(),
  }
}

export async function getUserRewards(userId: string) {
  const userRewards = await db
    .select()
    .from(rewards)
    .where(eq(rewards.userId, userId))
    .orderBy(asc(rewards.xpRequired))

  return userRewards.map(rewardToResponse)
}

export async function createReward(userId: string, input: CreateRewardInput) {
  const [reward] = await db
    .insert(rewards)
    .values({
      userId,
      title: input.title,
      description: input.description,
      emoji: input.emoji,
      xpRequired: input.xpRequired,
    })
    .returning()

  return rewardToResponse(reward)
}

export async function updateReward(userId: string, rewardId: string, input: UpdateRewardInput) {
  const [existing] = await db
    .select()
    .from(rewards)
    .where(and(eq(rewards.id, rewardId), eq(rewards.userId, userId)))

  if (!existing) return null

  const [updated] = await db
    .update(rewards)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(rewards.id, rewardId))
    .returning()

  return rewardToResponse(updated)
}

export async function deleteReward(userId: string, rewardId: string) {
  const [existing] = await db
    .select()
    .from(rewards)
    .where(and(eq(rewards.id, rewardId), eq(rewards.userId, userId)))

  if (!existing) return false

  await db.delete(rewards).where(eq(rewards.id, rewardId))
  return true
}

export async function redeemReward(userId: string, rewardId: string) {
  const [existing] = await db
    .select()
    .from(rewards)
    .where(and(eq(rewards.id, rewardId), eq(rewards.userId, userId)))

  if (!existing) return null
  if (existing.isRedeemed) return null

  const [updated] = await db
    .update(rewards)
    .set({
      isRedeemed: true,
      redeemedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(rewards.id, rewardId))
    .returning()

  return rewardToResponse(updated)
}
