"use client"

import React, { useState, useMemo } from "react"
import {
  useHabits,
  useCreateHabit,
  useUpdateHabit,
  useToggleHabit,
  useDeleteHabit,
} from "@/lib/api/hooks/use-habits"
import type { Habit } from "@/lib/shared/types"
import { toast } from "sonner"
import { useHabitNotifications } from "@/hooks/use-habit-notifications"
import { useSound } from "@/hooks/use-sound"
import { useConfetti } from "@/hooks/use-confetti"

export function useDashboard() {
  const todayStr = new Date().toISOString().split("T")[0]

  const { data: habits = [], isLoading } = useHabits()
  useHabitNotifications(habits)
  const createHabit = useCreateHabit()
  const updateHabit = useUpdateHabit()
  const toggleHabit = useToggleHabit()
  const deleteHabitMutation = useDeleteHabit()

  const { play } = useSound()
  const { fireHabitCheck } = useConfetti()

  const [expandedHabits, setExpandedHabits] = useState<Record<string, boolean>>({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [weekOffset, setWeekOffset] = useState(0)

  const visibleHabits = useMemo(() => {
    // selectedDate is "YYYY-MM-DD"; parse with noon to avoid timezone shifts
    const date = new Date(selectedDate + "T12:00:00")
    // JS getDay(): Sun=0…Sat=6 → app selectedDays index: Mon=0…Sun=6
    const dayIndex = (date.getDay() + 6) % 7

    return habits.filter((habit) => {
      if (!habit.createdAt) return true
      const createdDateStr = new Date(habit.createdAt).toISOString().split("T")[0]
      if (createdDateStr > selectedDate) return false
      return habit.selectedDays[dayIndex] === true
    })
  }, [habits, selectedDate])

  const pendingCount = useMemo(() => {
    return visibleHabits.filter((h) => !h.activities?.[selectedDate]).length
  }, [visibleHabits, selectedDate])

  const isSelectedToday = selectedDate === todayStr

  const selectedDateLabel = useMemo(() => {
    if (isSelectedToday) return "Today"
    const date = new Date(selectedDate + "T12:00:00")
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (selectedDate === yesterday.toISOString().split("T")[0]) return "Yesterday"
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }, [selectedDate, isSelectedToday])

  const openCreate = () => {
    setEditingHabit(null)
    setDrawerOpen(true)
  }

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setDrawerOpen(true)
  }

  const handleSave = (data: Omit<Habit, "id" | "activities" | "createdAt">) => {
    if (editingHabit) {
      updateHabit.mutate(
        { habitId: editingHabit.id, ...data },
        {
          onSuccess: () => toast.success("Habit updated"),
          onError: (err) => toast.error(err.message),
        }
      )
    } else {
      createHabit.mutate(data, {
        onSuccess: () => toast.success("Habit created"),
        onError: (err) => toast.error(err.message),
      })
    }
  }

  const handleToggleDate = (habitId: string, e: React.MouseEvent) => {
    const habit = visibleHabits.find((h) => h.id === habitId)
    const isCurrentlyDone = habit?.activities?.[selectedDate] ?? false

    if (!isCurrentlyDone) {
      const pendingBeforeToggle = visibleHabits.filter((h) => !h.activities?.[selectedDate]).length
      play(pendingBeforeToggle === 1 ? "success-day" : "check")
      fireHabitCheck({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    toggleHabit.mutate(
      { habitId, date: selectedDate },
      { onError: () => toast.error("Failed to update habit") }
    )
  }

  const handleDeleteHabit = (habitId: string) => {
    deleteHabitMutation.mutate(habitId, {
      onSuccess: () => toast.success("Habit deleted"),
      onError: () => toast.error("Failed to delete habit"),
    })
  }

  const toggleExpanded = (habitId: string) => {
    setExpandedHabits((prev) => ({ ...prev, [habitId]: !prev[habitId] }))
  }

  const jumpToDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const target = new Date(date)
    target.setHours(0, 0, 0, 0)

    if (target > today) return

    const currentSunday = new Date(today)
    currentSunday.setDate(today.getDate() - today.getDay())

    const targetSunday = new Date(target)
    targetSunday.setDate(target.getDate() - target.getDay())

    const diffMs = targetSunday.getTime() - currentSunday.getTime()
    const newWeekOffset = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000))

    setWeekOffset(newWeekOffset)
    setSelectedDate(target.toISOString().split("T")[0])
  }

  return {
    habits,
    isLoading,
    expandedHabits,
    drawerOpen,
    setDrawerOpen,
    editingHabit,
    selectedDate,
    setSelectedDate,
    weekOffset,
    setWeekOffset,
    visibleHabits,
    pendingCount,
    isSelectedToday,
    selectedDateLabel,
    openCreate,
    openEdit,
    handleSave,
    handleToggleDate,
    handleDeleteHabit,
    toggleExpanded,
    jumpToDate,
  }
}
