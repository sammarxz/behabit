"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../client"
import type { UserProfile, Habit } from "@/lib/shared/types"

export function useProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await api.api.profile.get()
      if (error) throw new Error("Failed to fetch profile")
      return data as UserProfile
    },
    enabled: options?.enabled ?? true,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { name?: string; username?: string; image?: string | null }) => {
      const { data, error } = await api.api.profile.patch(input)
      if (error) throw new Error("Failed to update profile")
      return data as UserProfile
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await api.api.profile.delete()
      if (error) throw new Error("Failed to delete account")
      return data
    },
  })
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      const { data, error } = await api.api.users({ username }).get()
      if (error) throw new Error("User not found")
      return data as { profile: Omit<UserProfile, "email">; habits: Habit[] }
    },
    enabled: !!username,
  })
}
