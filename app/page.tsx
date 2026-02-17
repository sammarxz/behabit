"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Zap, User, Globe, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type Habit } from "@/lib/habit-types"
import { DEFAULT_USER, type UserProfile } from "@/lib/user-types"
import { WeekStrip } from "@/components/week-strip"
import { HabitCard } from "@/components/habit-card"
import { CreateHabitDialog } from "@/components/create-habit-dialog"
import { EditProfilePage } from "@/components/edit-profile-page"
import { PublicProfilePage } from "@/components/public-profile-page"

type AppView = "dashboard" | "edit-profile" | "public-profile"

export default function HabitTrackerPage() {
  const todayStr = new Date().toISOString().split("T")[0]

  const [user, setUser] = useState<UserProfile>(DEFAULT_USER)
  const [currentView, setCurrentView] = useState<AppView>("dashboard")
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: "Run",
      emoji: "\uD83C\uDFC3",
      activities: generateSampleData(0.6),
      repeat: "daily",
      selectedDays: [true, true, true, true, true, false, false],
      remindMe: true,
      isPublic: true,
    },
    {
      id: 2,
      name: "Read",
      emoji: "\uD83D\uDCDA",
      activities: generateSampleData(0.75),
      repeat: "daily",
      selectedDays: [true, true, true, true, true, true, true],
      remindMe: false,
      isPublic: true,
    },
    {
      id: 3,
      name: "Meditate",
      emoji: "\uD83E\uDDD8",
      activities: generateSampleData(0.45),
      repeat: "daily",
      selectedDays: [true, true, true, true, true, true, true],
      remindMe: true,
      isPublic: false,
    },
  ])
  const [expandedHabits, setExpandedHabits] = useState<Record<number, boolean>>(
    {}
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [weekOffset, setWeekOffset] = useState(0)

  const bestStreak = useMemo(() => {
    if (habits.length === 0) return 0
    return habits.reduce((max, h) => {
      if (!h.activities) return max
      let streak = 0
      const today = new Date()
      for (let i = 0; i < 365; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        if (h.activities[date.toISOString().split("T")[0]]) {
          streak++
        } else {
          break
        }
      }
      return Math.max(max, streak)
    }, 0)
  }, [habits])

  const pendingCount = useMemo(() => {
    return habits.filter((h) => !h.activities?.[selectedDate]).length
  }, [habits, selectedDate])

  const isSelectedToday = selectedDate === todayStr

  const selectedDateLabel = useMemo(() => {
    if (isSelectedToday) return "Today"
    const date = new Date(selectedDate + "T12:00:00")
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (selectedDate === yesterday.toISOString().split("T")[0])
      return "Yesterday"
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }, [selectedDate, isSelectedToday])

  const handleCreateHabit = (data: Omit<Habit, "id" | "activities">) => {
    const newHabit: Habit = {
      ...data,
      id: Date.now(),
      activities: {},
    }
    setHabits((prev) => [...prev, newHabit])
  }

  const toggleDateForHabit = (habitId: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              activities: {
                ...h.activities,
                [selectedDate]: !h.activities?.[selectedDate],
              },
            }
          : h
      )
    )
  }

  const deleteHabit = (habitId: number) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId))
  }

  const toggleExpanded = (habitId: number) => {
    setExpandedHabits((prev) => ({ ...prev, [habitId]: !prev[habitId] }))
  }

  const handleUpdateProfile = (updated: UserProfile) => {
    setUser(updated)
  }

  const handleExportData = () => {
    const data = {
      profile: user,
      habits: habits,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `habitra-${user.username}-data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Shared Header
  const renderHeader = () => (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-2xl px-4 flex h-14 items-center justify-between">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <svg
            viewBox="0 0 76 65"
            fill="none"
            className="w-5 h-5 text-foreground"
          >
            <path
              d="M37.5274 0L75.0548 65H0L37.5274 0Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Habitra
          </span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
            <Zap className="w-3 h-3 text-foreground" />
            <span className="text-xs font-mono font-medium text-foreground">
              {bestStreak}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-medium bg-secondary text-secondary-foreground">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setCurrentView("edit-profile")}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCurrentView("public-profile")}
                className="cursor-pointer"
              >
                <Globe className="mr-2 h-4 w-4" />
                Public Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )

  if (currentView === "edit-profile") {
    return (
      <div className="min-h-screen bg-background">
        {renderHeader()}
        <EditProfilePage
          user={user}
          onUpdateProfile={handleUpdateProfile}
          onExportData={handleExportData}
          onBack={() => setCurrentView("dashboard")}
        />
      </div>
    )
  }

  if (currentView === "public-profile") {
    return (
      <div className="min-h-screen bg-background">
        {renderHeader()}
        <PublicProfilePage user={user} habits={habits} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}

      <main className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-5">
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
        />

        {/* My Habits Section */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div>
              <h2 className="text-base font-semibold text-card-foreground">
                My Habits
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedDateLabel}
                {" \u00B7 "}
                {pendingCount > 0
                  ? `${pendingCount} pending`
                  : "All done"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="h-8 gap-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              New habit
            </Button>
          </div>

          {/* Habit list */}
          <div className="px-3 pb-3 flex flex-col gap-1.5">
            {habits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium text-card-foreground mb-1">
                  No habits yet
                </h3>
                <p className="text-xs text-muted-foreground mb-4 max-w-[240px] leading-relaxed">
                  Start tracking your first habit. Even the smallest daily
                  action counts.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  className="h-8 text-xs gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create your first habit
                </Button>
              </div>
            ) : (
              habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  expanded={expandedHabits[habit.id] || false}
                  selectedDate={selectedDate}
                  onToggleExpanded={() => toggleExpanded(habit.id)}
                  onToggleDate={() => toggleDateForHabit(habit.id)}
                  onDelete={() => deleteHabit(habit.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Tip card */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3.5">
          <span className="text-base shrink-0 mt-px">{"\uD83D\uDCA1"}</span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Track the smallest possible habit and do it daily, even if {"it's"}{" "}
            only 10%.{" "}
            <a
              href="#"
              className="text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors"
            >
              Why? How?
            </a>
          </p>
        </div>
      </main>

      <CreateHabitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreateHabit={handleCreateHabit}
      />
    </div>
  )
}

function generateSampleData(probability: number): Record<string, boolean> {
  const activities: Record<string, boolean> = {}
  const today = new Date()
  for (let i = 1; i <= 365; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    if (Math.random() < probability) {
      activities[date.toISOString().split("T")[0]] = true
    }
  }
  return activities
}
