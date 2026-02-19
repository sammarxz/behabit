"use client"

import { useEffect, useRef } from "react"
import type { Habit } from "@/lib/shared/types"

function msUntilTime(timeStr: string): number {
  const [hourStr, minuteStr] = timeStr.split(":")
  const hours = parseInt(hourStr, 10)
  const minutes = parseInt(minuteStr, 10)

  if (isNaN(hours) || isNaN(minutes)) return -1

  const now = new Date()
  const target = new Date()
  target.setHours(hours, minutes, 0, 0)

  return target.getTime() - now.getTime()
}

export function useHabitNotifications(habits: Habit[]) {
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    if (typeof window === "undefined") return
    if (Notification.permission !== "granted") return

    const habitsToRemind = habits.filter((h) => h.remindMe && h.reminderTime)

    for (const habit of habitsToRemind) {
      const ms = msUntilTime(habit.reminderTime!)
      if (ms <= 0) continue

      const timeout = setTimeout(() => {
        new Notification(`${habit.emoji} ${habit.name}`, {
          body: "Time to tick your habit!",
          icon: "/favicon.ico",
          tag: `habit-reminder-${habit.id}`,
          renotify: true,
        } as NotificationOptions)
      }, ms)

      timeoutsRef.current.push(timeout)
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [habits])
}
