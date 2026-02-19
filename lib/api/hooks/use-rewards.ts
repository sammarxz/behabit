"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../client"
import type { Reward } from "@/lib/shared/types"

export function useRewards(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const { data, error } = await api.api.rewards.get()
      if (error) throw new Error("Failed to fetch rewards")
      return data as Reward[]
    },
    enabled: options?.enabled ?? true,
  })
}

export function useCreateReward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      input: Omit<Reward, "id" | "emoji" | "isRedeemed" | "redeemedAt" | "createdAt" | "updatedAt">
    ) => {
      const { data, error } = await api.api.rewards.post({
        title: input.title,
        description: input.description,
        xpRequired: input.xpRequired,
      })
      if (error) {
        const msg =
          typeof error === "object" && error !== null && "error" in error
            ? String((error as Record<string, unknown>).error)
            : String(error.value)
        throw new Error(msg)
      }
      return data as Reward
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] })
    },
  })
}

export function useUpdateReward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      rewardId,
      ...input
    }: Partial<Omit<Reward, "id" | "isRedeemed" | "redeemedAt" | "createdAt" | "updatedAt">> & {
      rewardId: string
    }) => {
      const body: Record<string, unknown> = {}
      if (input.title !== undefined) body.title = input.title
      if (input.description !== undefined) body.description = input.description
      if (input.emoji !== undefined) body.emoji = input.emoji
      if (input.xpRequired !== undefined) body.xpRequired = input.xpRequired

      const { data, error } = await api.api.rewards({ id: rewardId }).patch(body)
      if (error) {
        const msg =
          typeof error === "object" && error !== null && "error" in error
            ? String((error as Record<string, unknown>).error)
            : "Failed to update reward"
        throw new Error(msg)
      }
      return data as Reward
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] })
    },
  })
}

export function useDeleteReward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (rewardId: string) => {
      const { error } = await api.api.rewards({ id: rewardId }).delete()
      if (error) throw new Error("Failed to delete reward")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] })
    },
  })
}

export function useRedeemReward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (rewardId: string) => {
      const { data, error } = await api.api.rewards({ id: rewardId }).redeem.post({})
      if (error) throw new Error("Failed to redeem reward")
      return data as Reward
    },
    onMutate: async (rewardId) => {
      await queryClient.cancelQueries({ queryKey: ["rewards"] })
      const previousRewards = queryClient.getQueryData<Reward[]>(["rewards"])

      queryClient.setQueryData<Reward[]>(["rewards"], (old) =>
        old?.map((r) =>
          r.id === rewardId ? { ...r, isRedeemed: true, redeemedAt: new Date().toISOString() } : r
        )
      )

      return { previousRewards }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousRewards) {
        queryClient.setQueryData(["rewards"], context.previousRewards)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] })
    },
  })
}
