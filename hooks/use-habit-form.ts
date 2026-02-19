"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { type Habit, HABIT_PRESETS } from "@/lib/shared/types"
import { createHabitSchema } from "@/lib/shared/schemas/habit.schema"

type HabitFormValues = z.infer<typeof createHabitSchema>

export function useHabitForm(habit: Habit | null | undefined, open: boolean) {
  const isEditing = !!habit

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      name: "",
      emoji: "⭐",
      repeat: "daily",
      selectedDays: [true, true, true, true, true, true, true],
      remindMe: false,
      reminderTime: null,
      xpPerCheck: 10,
      isPublic: true,
    },
  })

  useEffect(() => {
    if (open && habit) {
      form.reset({
        name: habit.name,
        emoji: habit.emoji,
        repeat: habit.repeat,
        selectedDays: [...habit.selectedDays],
        remindMe: habit.remindMe,
        reminderTime: habit.reminderTime,
        xpPerCheck: habit.xpPerCheck,
        isPublic: habit.isPublic,
      })
    } else if (!open) {
      form.reset({
        name: "",
        emoji: "⭐",
        repeat: "daily",
        selectedDays: [true, true, true, true, true, true, true],
        remindMe: false,
        reminderTime: null,
        xpPerCheck: 10,
        isPublic: true,
      })
    }
  }, [habit, open]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectPreset = (preset: (typeof HABIT_PRESETS)[number]) => {
    form.setValue("name", preset.name)
    form.setValue("emoji", preset.emoji)
  }

  return {
    form,
    isEditing,
    handleSelectPreset,
  }
}
