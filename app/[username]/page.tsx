"use client"

import React, { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Target, CalendarCheck, ChevronUp, ChevronDown } from "lucide-react"
import { HeatMap } from "@/components/heat-map"
import { SiteHeader } from "@/components/site-header"
import { usePublicProfile } from "@/lib/api/hooks/use-profile"
import { calculateStreak, calculateConsistency, calculateCheckIns } from "@/lib/shared/types"
import { Button } from "@/components/ui/button"

export default function PublicProfilePage() {
  const [expandedHabits, setExpandedHabits] = useState<Set<string>>(new Set())
  const params = useParams()
  const username = params.username as string
  const { data, isLoading, error } = usePublicProfile(username)

  const profile = data?.profile
  const habits = data?.habits ?? []

  const initials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? ""

  const totalXP = useMemo(() => {
    return habits.reduce((total, h) => {
      return total + calculateCheckIns(h.activities) * 10
    }, 0)
  }, [habits])

  const totalCheckIns = useMemo(() => {
    return habits.reduce((total, h) => total + calculateCheckIns(h.activities), 0)
  }, [habits])

  const overallStreak = useMemo(() => {
    return habits.reduce((max, h) => Math.max(max, calculateStreak(h.activities)), 0)
  }, [habits])

  const toggleExpanded = (habitId: string) => {
    setExpandedHabits((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(habitId)) {
        newSet.delete(habitId)
      } else {
        newSet.add(habitId)
      }
      return newSet
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-6">
          <div className="flex flex-col gap-6">
            {/* Profile header */}
            <div className="px-6 py-8 flex flex-col items-center gap-3">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>

            {/* Stats + habits card */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center gap-2 py-5 ${i === 1 ? "border-x border-border" : ""}`}
                  >
                    <Skeleton className="h-6 w-10" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex flex-col">
                {[0, 1, 2].map((i) => (
                  <div key={i}>
                    {i > 0 && <Separator />}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                        <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-7 w-7 rounded-md shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-6">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-lg font-semibold text-foreground mb-2">User not found</h1>
            <p className="text-sm text-muted-foreground">The profile @{username} does not exist.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Profile Header */}
          <div className="px-6 py-8 flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-4 outline-1 outline-brackground border-2">
              {profile.image && <AvatarImage src={profile.image} />}
              <AvatarFallback className="text-2xl font-semibold bg-secondary text-secondary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-semibold text-card-foreground">{profile.name}</h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5">
              <Zap className="h-3.5 w-3.5 text-foreground" />
              <span className="text-xs font-mono font-semibold text-foreground">
                {totalXP.toLocaleString()} XP
              </span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
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
                  {habits.length}
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
            <Separator />
            <div className="flex flex-col">
              {habits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <p className="text-sm text-muted-foreground">No public habits to show.</p>
                </div>
              ) : (
                habits.map((habit, index) => {
                  const streak = calculateStreak(habit.activities)
                  const consistency = calculateConsistency(habit.activities, habit.createdAt)
                  const checkIns = calculateCheckIns(habit.activities)
                  return (
                    <React.Fragment key={habit.id}>
                      {index > 0 && <Separator />}
                      <div className="flex flex-col">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex gap-4 items-center">
                            <span className="text-lg">{habit.emoji}</span>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-medium text-card-foreground">
                                {habit.name}
                              </span>
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
                          </div>
                          {/* Expand toggle */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground shrink-0"
                            onClick={() => toggleExpanded(habit.id)}
                          >
                            {expandedHabits.has(habit.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <AnimatePresence>
                          {expandedHabits.has(habit.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <motion.div className="overflow-hidden p-4">
                                <HeatMap activities={habit.activities ?? {}} expanded={true} />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </React.Fragment>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
