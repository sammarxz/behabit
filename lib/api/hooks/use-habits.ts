"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../client"
import type { Habit } from "@/lib/shared/types"

export function useHabits(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data, error } = await api.api.habits.get()
      if (error) throw new Error("Failed to fetch habits")
      return data as Habit[]
    },
    enabled: options?.enabled ?? true,
  })
}

function buildHabitBody(input: Omit<Habit, "id" | "activities" | "createdAt">) {
  return {
    name: input.name,
    emoji: input.emoji,
    repeat: input.repeat,
    selectedDays: input.selectedDays,
    remindMe: input.remindMe,
    reminderTime: input.reminderTime ?? undefined,
    xpPerCheck: input.xpPerCheck,
    isPublic: input.isPublic,
  }
}

export function useCreateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Omit<Habit, "id" | "activities" | "createdAt">) => {
      const body = buildHabitBody(input)
      const { data, error } = await api.api.habits.post(body)
      if (error) {
        const msg =
          typeof error === "object" && error !== null && "error" in error
            ? String((error as Record<string, unknown>).error)
            : String(error.value)
        throw new Error(msg)
      }
      return data as Habit
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] })
    },
  })
}

export function useUpdateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      habitId,
      ...input
    }: Partial<Omit<Habit, "id" | "activities" | "createdAt">> & { habitId: string }) => {
      const body: Record<string, unknown> = {}
      if (input.name !== undefined) body.name = input.name
      if (input.emoji !== undefined) body.emoji = input.emoji
      if (input.repeat !== undefined) body.repeat = input.repeat
      if (input.selectedDays !== undefined) body.selectedDays = input.selectedDays
      if (input.remindMe !== undefined) body.remindMe = input.remindMe
      if (input.reminderTime !== undefined) body.reminderTime = input.reminderTime ?? undefined
      if (input.xpPerCheck !== undefined) body.xpPerCheck = input.xpPerCheck
      if (input.isPublic !== undefined) body.isPublic = input.isPublic

      const { data, error } = await api.api.habits({ id: habitId }).patch(body)
      if (error) {
        const msg =
          typeof error === "object" && error !== null && "error" in error
            ? String((error as Record<string, unknown>).error)
            : "Failed to update habit"
        throw new Error(msg)
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] })
    },
  })
}

export function useDeleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await api.api.habits({ id: habitId }).delete()
      if (error) throw new Error("Failed to delete habit")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] })
    },
  })
}

export function useToggleHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
      const { data, error } = await api.api.habits({ id: habitId }).toggle.post({ date })
      if (error) throw new Error("Failed to toggle habit")
      return data as { date: string; completed: boolean }
    },
    onMutate: async ({ habitId, date }) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] })

      const previousHabits = queryClient.getQueryData<Habit[]>(["habits"])

      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old?.map((h) =>
          h.id === habitId
            ? {
                ...h,
                activities: {
                  ...h.activities,
                  [date]: !h.activities?.[date],
                },
              }
            : h
        )
      )

      return { previousHabits }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(["habits"], context.previousHabits)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] })
    },
  })
}
