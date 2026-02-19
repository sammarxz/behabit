"use client"

import React from "react"
import { ChevronDown, ChevronUp, Zap, Target, Trash2, Pencil, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeatMap } from "@/components/heat-map"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  type Habit,
  calculateStreak,
  calculateConsistency,
  calculateCheckIns,
} from "@/lib/shared/types"
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface HabitCardProps {
  habit: Habit
  expanded: boolean
  selectedDate: string
  onToggleExpanded: () => void
  onToggleDate: (e: React.MouseEvent) => void
  onDelete: () => void
  onEdit?: () => void
}

export function HabitCard({
  habit,
  expanded,
  selectedDate,
  onToggleExpanded,
  onToggleDate,
  onDelete,
  onEdit,
}: HabitCardProps) {
  const streak = calculateStreak(habit.activities)
  const consistency = calculateConsistency(habit.activities, habit.createdAt)
  const checkIns = calculateCheckIns(habit.activities)
  const isDone = habit.activities?.[selectedDate] ?? false

  const todayStr = new Date().toISOString().split("T")[0]
  const isFuture = selectedDate > todayStr

  return (
    <div
      className={`bg-foreground/5 border border-border/50 rounded-lg overflow-hidden transition-all ${cn(isDone ? "bg-foreground/10" : "")}`}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 p-4">
        {/* Completion circle */}
        <button
          onClick={onToggleDate}
          disabled={isFuture}
          className="shrink-0 cursor-pointer group disabled:cursor-default disabled:opacity-40"
          aria-label={isDone ? "Mark as incomplete" : "Mark as complete"}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              isDone ? "bg-primary" : "border-2 border-border group-hover:border-muted-foreground"
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

        {/* Expand toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground shrink-0"
          onClick={onToggleExpanded}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {expanded && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-4 border-t border-border"
            >
              {/* Stats row */}
              <div className="grid grid-cols-3 border-b">
                <div className="flex flex-col py-4 items-center gap-0.5">
                  <span className="text-xl font-bold font-mono text-card-foreground">{streak}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    Streak
                  </span>
                </div>
                <div className="flex flex-col py-4 items-center gap-0.5 border-x border-border">
                  <span className="text-xl font-bold font-mono text-card-foreground">
                    {consistency}
                    <span className="text-sm">%</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    Consistency
                  </span>
                </div>
                <div className="flex flex-col py-4 items-center gap-0.5">
                  <span className="text-xl font-bold font-mono text-card-foreground">
                    {checkIns}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    Check-ins
                  </span>
                </div>
              </div>

              {/* Full heatmap */}
              <div className="overflow-hidden px-4">
                <HeatMap activities={habit.activities ?? {}} expanded={true} />
              </div>

              {/* Actions */}
              <div className="flex items-center border-t -gap-1">
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 h-9 text-xs gap-1.5 rounded-none m-0 border-none"
                    onClick={onEdit}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 h-9 text-xs gap-1.5 rounded-none m-0 border-none"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this habit?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove &quot;{habit.name}&quot; and all its check-in
                        history. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  )
}
