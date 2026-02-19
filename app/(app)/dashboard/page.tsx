"use client"

import React from "react"
import { Plus, Flame } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { WeekStrip } from "@/components/week-strip"
import { HabitCard } from "@/components/habit-card"
import { HabitDrawer } from "@/components/habit-drawer"
import { useDashboard } from "@/hooks/use-dashboard"
import { AnimatePresence, motion } from "framer-motion"
import { progressColor } from "@/lib/utils"
import {
  Gauge,
  GaugeIndicator,
  GaugeTrack,
  GaugeRange,
  GaugeValueText,
} from "@/components/ui/gauge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardPage() {
  const {
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
    selectedDateLabel,
    openCreate,
    openEdit,
    handleSave,
    handleToggleDate,
    handleDeleteHabit,
    toggleExpanded,
    jumpToDate,
  } = useDashboard()

  const completedCount = visibleHabits.length - pendingCount
  const completedPercent =
    visibleHabits.length > 0 ? Math.round((completedCount / visibleHabits.length) * 100) : 0

  if (isLoading) {
    return (
      <main className="mx-auto max-w-lg px-4 py-6 pb-28 flex flex-col gap-8">
        {/* WeekStrip skeleton */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
          <div className="flex items-center">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <Skeleton className="h-2 w-5" />
                <Skeleton className="h-[34px] w-[34px] rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* My Habits card skeleton */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-[52px] w-[52px] rounded-full shrink-0" />
          </div>
          <div className="px-4 flex flex-col gap-1.5 pb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-foreground/5 border border-border/50 rounded-lg p-4 flex items-center gap-3"
              >
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-7 w-7 rounded-md shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <main className="mx-auto max-w-lg px-4 py-6 pb-28 flex flex-col gap-8">
        {/* Week Calendar Strip */}
        <WeekStrip
          habits={habits}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          weekOffset={weekOffset}
          onPrevWeek={() => setWeekOffset((o) => o - 1)}
          onNextWeek={() => {
            if (weekOffset < 0) setWeekOffset((o) => o + 1)
          }}
          onJumpToDate={jumpToDate}
        />

        {/* My Habits Section */}
        <Card className="overflow-hidden  gap-2">
          {/* Section header */}
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-base font-semibold text-card-foreground">My Habits</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedDateLabel}
                  {" · "}
                  {pendingCount > 0 ? `${pendingCount} pending` : "All done"}
                </p>
              </div>

              {/* Circular progress with flame */}
              <Gauge value={completedPercent} size={52} thickness={4}>
                <GaugeIndicator>
                  <GaugeTrack />
                  <GaugeRange className={progressColor(completedPercent)} />
                </GaugeIndicator>
                <GaugeValueText className="text-base">
                  <Flame className={`h-4 w-4 text-white/50`} />
                </GaugeValueText>
              </Gauge>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {/* Habit list */}
            <AnimatePresence initial={false}>
              {habits.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium text-card-foreground mb-1">No habits yet</h3>
                  <p className="text-xs text-muted-foreground mb-4 max-w-[240px] leading-relaxed">
                    Start tracking your first habit. Even the smallest daily action counts.
                  </p>
                </motion.div>
              ) : (
                visibleHabits.map((habit) => (
                  <motion.div key={habit.id} className="">
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden mb-1.5 last:mb-0 space-y-4"
                    >
                      <HabitCard
                        habit={habit}
                        expanded={expandedHabits[habit.id] || false}
                        selectedDate={selectedDate}
                        onToggleExpanded={() => toggleExpanded(habit.id)}
                        onToggleDate={(e) => handleToggleDate(habit.id, e)}
                        onDelete={() => handleDeleteHabit(habit.id)}
                        onEdit={() => openEdit(habit)}
                      />
                    </motion.div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <HabitDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onSave={handleSave}
          habit={editingHabit}
        />
      </main>

      {/* FAB — create habit */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md">
        <div className="w-full flex justify-center max-w-lg mx-auto md:px-4">
          <Button onClick={openCreate} size="lg" variant="outline" className="w-full">
            <Plus className="h-6 w-6" />
            Create new habit
          </Button>
        </div>
      </div>
    </>
  )
}
