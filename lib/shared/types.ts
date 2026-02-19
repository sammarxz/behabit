export type HabitPreset = {
  emoji: string
  name: string
}

export const HABIT_PRESETS: HabitPreset[] = [
  { emoji: "💪", name: "Workout" },
  { emoji: "🇪🇸", name: "Learn Spanish" },
  { emoji: "🇺🇸", name: "Learn English" },
  { emoji: "🚬", name: "Stop smoking" },
  { emoji: "📚", name: "Read" },
  { emoji: "🇨🇳", name: "Learn Chinese" },
  { emoji: "🚫", name: "No alcohol" },
  { emoji: "🧘", name: "Meditate" },
  { emoji: "💧", name: "Drink water" },
  { emoji: "🚶", name: "Walk" },
  { emoji: "😴", name: "Sleep 8h" },
  { emoji: "🎨", name: "Draw" },
]

export const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"]

export type Habit = {
  id: string
  name: string
  emoji: string
  activities: Record<string, boolean>
  repeat: "daily" | "weekly" | "monthly"
  selectedDays: boolean[]
  remindMe: boolean
  reminderTime: string | null
  xpPerCheck: number
  isPublic: boolean
  createdAt: string
}

export type UserProfile = {
  id: string
  name: string
  username: string
  email: string
  image?: string | null
  hasPassword: boolean
}

export type Reward = {
  id: string
  title: string
  description: string | null
  emoji: string
  xpRequired: number
  isRedeemed: boolean
  redeemedAt: string | null
  createdAt: string
  updatedAt: string
}

export function calculateTotalXP(habits: Habit[]): number {
  return habits.reduce((total, h) => {
    const checkIns = Object.values(h.activities).filter(Boolean).length
    return total + checkIns * (h.xpPerCheck || 0)
  }, 0)
}

export function calculateSpentXP(rewards: Reward[]): number {
  return rewards.filter((r) => r.isRedeemed).reduce((total, r) => total + r.xpRequired, 0)
}

export const generateDates = (days: number): string[] => {
  const dates: string[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
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

export const calculateConsistency = (
  activities: Record<string, boolean> | undefined,
  createdAt?: string
): number => {
  if (!activities) return 0
  const dates = generateDates(30)

  let validDates = dates
  if (createdAt) {
    const createdDateStr = new Date(createdAt).toISOString().split("T")[0]
    validDates = dates.filter((d) => d >= createdDateStr)
  }

  if (validDates.length === 0) return 0

  const completedDays = validDates.filter((date) => activities[date]).length
  return Math.round((completedDays / validDates.length) * 100)
}

export const calculateCheckIns = (activities: Record<string, boolean> | undefined): number => {
  if (!activities) return 0
  return Object.values(activities).filter(Boolean).length
}
