"use client"

import React from "react"
import { ChevronDown, ChevronUp, Zap, Target, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeatMap } from "@/components/heat-map"
import {
  type Habit,
  calculateStreak,
  calculateConsistency,
  calculateCheckIns,
} from "@/lib/habit-types"

interface HabitCardProps {
  habit: Habit
  expanded: boolean
  selectedDate: string
  onToggleExpanded: () => void
  onToggleDate: () => void
  onDelete: () => void
}

export function HabitCard({
  habit,
  expanded,
  selectedDate,
  onToggleExpanded,
  onToggleDate,
  onDelete,
}: HabitCardProps) {
  const streak = calculateStreak(habit.activities)
  const consistency = calculateConsistency(habit.activities)
  const checkIns = calculateCheckIns(habit.activities)
  const isDone = habit.activities?.[selectedDate] ?? false

  const todayStr = new Date().toISOString().split("T")[0]
  const isFuture = selectedDate > todayStr

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all ${
        isDone ? "border-foreground/20 bg-accent/50" : "border-border bg-card"
      }`}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Completion circle */}
        <button
          onClick={onToggleDate}
          disabled={isFuture}
          className="shrink-0 cursor-pointer group disabled:cursor-default disabled:opacity-40"
          aria-label={isDone ? "Mark as incomplete" : "Mark as complete"}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isDone
                ? "bg-foreground"
                : "border-2 border-border group-hover:border-muted-foreground"
            }`}
          >
            {isDone && <Check className="w-4 h-4 text-background" />}
          </div>
        </button>

        {/* Name and stats */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-card-foreground flex items-center gap-1.5">
            <span>{habit.emoji}</span>
            <span className="truncate">{habit.name}</span>
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Zap className="w-3 h-3" />
              {streak}d streak
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Target className="w-3 h-3" />
              {consistency}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={onToggleExpanded}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-4 border-t border-border">
          {/* Stats row */}
          <div className="grid grid-cols-3 pt-4">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-bold font-mono text-card-foreground">
                {streak}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Streak
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5 border-x border-border">
              <span className="text-xl font-bold font-mono text-card-foreground">
                {consistency}
                <span className="text-sm">%</span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Consistency
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-bold font-mono text-card-foreground">
                {checkIns}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Check-ins
              </span>
            </div>
          </div>

          {/* Full heatmap */}
          <div className="overflow-x-auto pt-1">
            <HeatMap activities={habit.activities ?? {}} expanded={true} />
          </div>
        </div>
      )}
    </div>
  )
}
