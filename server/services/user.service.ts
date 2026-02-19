import { eq, and } from "drizzle-orm"
import { db } from "../db"
import { user, account, habits, habitCompletions } from "../db/schema"
import type { z } from "zod"
import type { updateProfileSchema } from "@/lib/shared/schemas/user.schema"

type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export async function getProfile(userId: string) {
  const [profile] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
    })
    .from(user)
    .where(eq(user.id, userId))

  if (!profile) return null

  const [credentialAccount] = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "credential")))

  return { ...profile, hasPassword: !!credentialAccount }
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  // Check username uniqueness if changing
  if (input.username) {
    const [existing] = await db.select().from(user).where(eq(user.username, input.username))

    if (existing && existing.id !== userId) {
      return { error: "Username already taken" }
    }
  }

  const [updated] = await db
    .update(user)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
    })

  return updated
}

export async function checkUsernameAvailability(userId: string, username: string) {
  const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.username, username))

  return { available: !existing || existing.id === userId }
}

export async function deleteAccount(userId: string) {
  await db.delete(user).where(eq(user.id, userId))
}

export async function getPublicProfile(username: string) {
  const [profile] = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
    })
    .from(user)
    .where(eq(user.username, username))

  return profile || null
}
