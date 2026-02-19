import type { Habit } from "@/lib/shared/types"

export function useWeekStrip(habits: Habit[], weekOffset: number, daysToShow: number = 9) {
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  const referenceDate = new Date(today)
  referenceDate.setDate(today.getDate() + weekOffset * 7)
  const dayOfWeek = referenceDate.getDay()

  // Extra days before Sunday to pad to daysToShow (7 = full week only, 9 = +2 extra)
  const extraDays = daysToShow - 7
  const weekDays = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(referenceDate)
    date.setDate(referenceDate.getDate() - dayOfWeek - extraDays + i)
    return date
  })

  const isCurrentWeek = weekOffset === 0

  const weekRangeLabel = `${weekDays[0].toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${weekDays[daysToShow - 1].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`

  const getCompletionProgress = (date: Date): number => {
    const dateStr = date.toISOString().split("T")[0]
    // JS getDay(): Sun=0…Sat=6 → app selectedDays: Mon=0…Sun=6
    const dayIndex = (date.getDay() + 6) % 7
    const validHabits = habits.filter((h) => {
      if (h.createdAt && new Date(h.createdAt).toISOString().split("T")[0] > dateStr) return false
      return h.selectedDays[dayIndex] === true
    })
    if (validHabits.length === 0) return 0
    const completed = validHabits.filter((h) => h.activities?.[dateStr]).length
    return Math.round((completed / validHabits.length) * 100)
  }

  return { weekDays, todayStr, isCurrentWeek, weekRangeLabel, getCompletionProgress }
}
