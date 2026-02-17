"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface WeekStripProps {
  habits: { activities: Record<string, boolean> }[]
  selectedDate: string
  onSelectDate: (date: string) => void
  weekOffset: number
  onPrevWeek: () => void
  onNextWeek: () => void
}

function CircularProgress({
  progress,
  size = 44,
  strokeWidth = 2.5,
  children,
}: {
  progress: number
  size?: number
  strokeWidth?: number
  children: React.ReactNode
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        {progress > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={
              progress >= 100
                ? "hsl(var(--foreground))"
                : "hsl(var(--muted-foreground))"
            }
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export function WeekStrip({
  habits,
  selectedDate,
  onSelectDate,
  weekOffset,
  onPrevWeek,
  onNextWeek,
}: WeekStripProps) {
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  const referenceDate = new Date(today)
  referenceDate.setDate(today.getDate() + weekOffset * 7)
  const dayOfWeek = referenceDate.getDay()

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(referenceDate)
    date.setDate(referenceDate.getDate() - dayOfWeek + i)
    return date
  })

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getCompletionProgress = (date: Date): number => {
    const dateStr = date.toISOString().split("T")[0]
    if (habits.length === 0) return 0
    const completed = habits.filter((h) => h.activities?.[dateStr]).length
    return Math.round((completed / habits.length) * 100)
  }

  const isCurrentWeek = weekOffset === 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onPrevWeek}
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-muted-foreground">
          {weekDays[0].toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          {" - "}
          {weekDays[6].toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <button
          onClick={onNextWeek}
          disabled={isCurrentWeek}
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
          aria-label="Next week"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {weekDays.map((date, i) => {
          const dateStr = date.toISOString().split("T")[0]
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const isFuture = dateStr > todayStr
          const progress = isFuture ? 0 : getCompletionProgress(date)

          return (
            <button
              key={dateStr}
              onClick={() => {
                if (!isFuture) onSelectDate(dateStr)
              }}
              disabled={isFuture}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-opacity disabled:opacity-30 disabled:cursor-default ${
                isSelected ? "opacity-100" : "opacity-60 hover:opacity-90"
              }`}
            >
              <span
                className={`text-[10px] font-medium uppercase tracking-wider ${
                  isSelected
                    ? "text-foreground"
                    : isToday
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {dayLabels[i]}
              </span>

              <CircularProgress progress={progress} size={42} strokeWidth={2.5}>
                <div
                  className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isSelected
                      ? progress >= 100
                        ? "bg-foreground text-background"
                        : "bg-foreground text-background"
                      : progress >= 100
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {date.getDate()}
                </div>
              </CircularProgress>
            </button>
          )
        })}
      </div>
    </div>
  )
}
