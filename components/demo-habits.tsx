"use client"

import React, { useState, useMemo } from "react"
import { Check, Zap, Target, Flame } from "lucide-react"
import { calculateStreak, calculateConsistency } from "@/lib/shared/types"
import { useSound } from "@/hooks/use-sound"
import { useConfetti } from "@/hooks/use-confetti"
import { cn, progressColor } from "@/lib/utils"
import {
  Gauge,
  GaugeIndicator,
  GaugeTrack,
  GaugeRange,
  GaugeValueText,
} from "@/components/ui/gauge"
import { Card } from "./ui/card"

// Deterministic pseudo-random: same date + seed always gives same result
function activityForDate(date: string, seed: number, pct: number): boolean {
  const str = `${seed}-${date}`
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff
  }
  return Math.abs(hash) % 100 < pct * 100
}

function generateActivities(seed: number, pct: number, daysBack = 120): Record<string, boolean> {
  const today = new Date()
  const result: Record<string, boolean> = {}
  for (let i = 1; i <= daysBack; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    result[d.toISOString().split("T")[0]] = activityForDate(
      d.toISOString().split("T")[0],
      seed,
      pct
    )
  }
  return result
}

const DEMO_HABITS = [
  { id: "d1", emoji: "💪", name: "Workout", seed: 42, pct: 0.72, initialDone: false },
  { id: "d2", emoji: "📚", name: "Read 30 min", seed: 17, pct: 0.88, initialDone: true },
  { id: "d3", emoji: "🧘", name: "Meditate", seed: 99, pct: 0.65, initialDone: false },
  { id: "d4", emoji: "💧", name: "Drink water", seed: 7, pct: 0.93, initialDone: true },
]

interface DemoHabitRowProps {
  emoji: string
  name: string
  activities: Record<string, boolean>
  isDone: boolean
  onToggle: (e: React.MouseEvent) => void
}

function DemoHabitRow({ emoji, name, activities, isDone, onToggle }: DemoHabitRowProps) {
  const streak = calculateStreak(activities)
  const consistency = calculateConsistency(activities)

  return (
    <div
      className={cn(
        "bg-foreground/5 border border-border/50 rounded-lg overflow-hidden transition-colors",
        isDone && "bg-foreground/10"
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          onClick={onToggle}
          className="shrink-0 cursor-pointer group"
          aria-label={isDone ? "Mark as incomplete" : "Mark as complete"}
        >
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-all",
              isDone ? "bg-primary" : "border-2 border-border group-hover:border-muted-foreground"
            )}
          >
            {isDone && <Check className="w-4 h-4 text-background" />}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-card-foreground flex items-center gap-1.5">
            <span>{emoji}</span>
            <span className="truncate">{name}</span>
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] text-foreground/60">
              <Zap className="w-3 h-3" />
              {streak}d streak
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-foreground/60">
              <Target className="w-3 h-3" />
              {consistency}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DemoHabits() {
  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  const baseHabits = useMemo(
    () =>
      DEMO_HABITS.map((cfg) => ({
        ...cfg,
        activities: generateActivities(cfg.seed, cfg.pct),
      })),
    []
  )

  const [done, setDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DEMO_HABITS.map((h) => [h.id, h.initialDone]))
  )

  const { play } = useSound()
  const { fireHabitCheck } = useConfetti()

  const handleToggle = (id: string, e: React.MouseEvent) => {
    if (!done[id]) {
      const pendingCount = baseHabits.filter((h) => !done[h.id]).length
      play(pendingCount === 1 ? "success-day" : "check")
      fireHabitCheck({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    setDone((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const habitsWithToday = useMemo(
    () =>
      baseHabits.map((h) => ({
        ...h,
        activities: { ...h.activities, [today]: done[h.id] ?? false },
      })),
    [baseHabits, done, today]
  )

  const pendingCount = baseHabits.filter((h) => !done[h.id]).length
  const completedCount = baseHabits.length - pendingCount
  const completedPercent =
    baseHabits.length > 0 ? Math.round((completedCount / baseHabits.length) * 100) : 0

  return (
    <Card className="w-full max-w-[360px] p-4 bg-transparent">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">My Habits</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Today ·{" "}
            {pendingCount > 0 ? (
              <span>{pendingCount} pending</span>
            ) : (
              <span className="text-foreground font-medium">All done! 🎉</span>
            )}
          </p>
        </div>
        <Gauge value={completedPercent} size={52} thickness={4}>
          <GaugeIndicator>
            <GaugeTrack />
            <GaugeRange className={progressColor(completedPercent)} />
          </GaugeIndicator>
          <GaugeValueText className="text-base">
            <Flame className="h-4 w-4 text-white/50" />
          </GaugeValueText>
        </Gauge>
      </div>

      {/* Habit rows */}
      <div className="flex flex-col gap-2">
        {habitsWithToday.map((habit) => (
          <DemoHabitRow
            key={habit.id}
            emoji={habit.emoji}
            name={habit.name}
            activities={habit.activities}
            isDone={done[habit.id] ?? false}
            onToggle={(e) => handleToggle(habit.id, e)}
          />
        ))}
      </div>
    </Card>
  )
}
