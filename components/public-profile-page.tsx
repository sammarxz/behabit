"use client"

import React, { useMemo } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Zap, Target, CalendarCheck } from "lucide-react"
import { HeatMap } from "@/components/heat-map"
import {
  type Habit,
  calculateStreak,
  calculateConsistency,
  calculateCheckIns,
} from "@/lib/habit-types"
import { type UserProfile } from "@/lib/user-types"

interface PublicProfilePageProps {
  user: UserProfile
  habits: Habit[]
}

export function PublicProfilePage({ user, habits }: PublicProfilePageProps) {
  const publicHabits = habits.filter((h) => h.isPublic)

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const totalXP = useMemo(() => {
    return habits.reduce((total, h) => {
      return total + calculateCheckIns(h.activities) * 10
    }, 0)
  }, [habits])

  const totalCheckIns = useMemo(() => {
    return habits.reduce((total, h) => total + calculateCheckIns(h.activities), 0)
  }, [habits])

  const overallStreak = useMemo(() => {
    return habits.reduce(
      (max, h) => Math.max(max, calculateStreak(h.activities)),
      0
    )
  }, [habits])

  // Merge all public habits into one combined activity map for the year heatmap
  const combinedActivities = useMemo(() => {
    const combined: Record<string, boolean> = {}
    publicHabits.forEach((h) => {
      if (h.activities) {
        Object.entries(h.activities).forEach(([date, done]) => {
          if (done) combined[date] = true
        })
      }
    })
    return combined
  }, [publicHabits])

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-8 flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarFallback className="text-2xl font-semibold bg-secondary text-secondary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-semibold text-card-foreground">
              {user.name}
            </h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>

            {/* XP Badge */}
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5">
              <Zap className="h-3.5 w-3.5 text-foreground" />
              <span className="text-xs font-mono font-semibold text-foreground">
                {totalXP.toLocaleString()} XP
              </span>
            </div>
          </div>

          <Separator />

          {/* Overall Stats */}
          <div className="grid grid-cols-3">
            <div className="flex flex-col items-center gap-1 py-5">
              <span className="text-xl font-bold font-mono text-card-foreground">
                {overallStreak}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Best Streak
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 py-5 border-x border-border">
              <span className="text-xl font-bold font-mono text-card-foreground">
                {publicHabits.length}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Habits
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 py-5">
              <span className="text-xl font-bold font-mono text-card-foreground">
                {totalCheckIns.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Check-ins
              </span>
            </div>
          </div>
        </div>

        {/* Year Heatmap */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5">
            <h2 className="text-sm font-semibold text-card-foreground">
              Activity
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              All public habit check-ins over the past year.
            </p>
          </div>
          <Separator />
          <div className="px-6 py-5 overflow-x-auto">
            <HeatMap activities={combinedActivities} expanded={true} />
          </div>
        </div>

        {/* Habits List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5">
            <h2 className="text-sm font-semibold text-card-foreground">
              Habits
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {publicHabits.length} public habit
              {publicHabits.length !== 1 ? "s" : ""} being tracked.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col">
            {publicHabits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <p className="text-sm text-muted-foreground">
                  No public habits to show.
                </p>
              </div>
            ) : (
              publicHabits.map((habit, index) => {
                const streak = calculateStreak(habit.activities)
                const consistency = calculateConsistency(habit.activities)
                const checkIns = calculateCheckIns(habit.activities)
                return (
                  <React.Fragment key={habit.id}>
                    {index > 0 && <Separator />}
                    <div className="px-6 py-4 flex flex-col gap-4">
                      {/* Habit name + inline stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{habit.emoji}</span>
                          <span className="text-sm font-medium text-card-foreground">
                            {habit.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Zap className="w-3 h-3" />
                            {streak}d
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Target className="w-3 h-3" />
                            {consistency}%
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <CalendarCheck className="w-3 h-3" />
                            {checkIns}
                          </span>
                        </div>
                      </div>

                      {/* Mini heatmap per habit */}
                      <div className="overflow-x-auto">
                        <HeatMap
                          activities={habit.activities ?? {}}
                          expanded={false}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                )
              })
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
