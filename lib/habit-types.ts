export type Habit = {
  id: number
  name: string
  emoji: string
  activities: Record<string, boolean>
  repeat: "daily" | "weekly" | "monthly"
  selectedDays: boolean[]
  remindMe: boolean
  isPublic: boolean
}

export type HabitPreset = {
  emoji: string
  name: string
}

export const HABIT_PRESETS: HabitPreset[] = [
  { emoji: "\uD83D\uDCAA", name: "Workout" },
  { emoji: "\uD83C\uDDEA\uD83C\uDDF8", name: "Learn Spanish" },
  { emoji: "\uD83C\uDDFA\uD83C\uDDF8", name: "Learn English" },
  { emoji: "\uD83D\uDEAC", name: "Stop smoking" },
  { emoji: "\uD83D\uDCDA", name: "Read" },
  { emoji: "\uD83C\uDDE8\uD83C\uDDF3", name: "Learn Chinese" },
  { emoji: "\uD83D\uDEAB", name: "No alcohol" },
  { emoji: "\uD83E\uDDD8", name: "Meditate" },
  { emoji: "\uD83D\uDCA7", name: "Drink water" },
  { emoji: "\uD83D\uDEB6", name: "Walk" },
  { emoji: "\uD83D\uDE34", name: "Sleep 8h" },
  { emoji: "\uD83C\uDFA8", name: "Draw" },
]

export const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"]

export const generateDates = (days: number): string[] => {
  const dates: string[] = []
  const today = new Date()
  for (let i = days; i > 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split("T")[0])
  }
  return dates
}

export const calculateStreak = (activities: Record<string, boolean> | undefined): number => {
  if (!activities) return 0
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateString = date.toISOString().split("T")[0]
    if (activities[dateString]) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export const calculateConsistency = (activities: Record<string, boolean> | undefined): number => {
  if (!activities) return 0
  const dates = generateDates(30)
  const completedDays = dates.filter((date) => activities[date]).length
  return Math.round((completedDays / 30) * 100)
}

export const calculateCheckIns = (activities: Record<string, boolean> | undefined): number => {
  if (!activities) return 0
  return Object.values(activities).filter(Boolean).length
}
