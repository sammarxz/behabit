"use client"

import React, { useMemo } from "react"
import { generateDates } from "@/lib/habit-types"

interface HeatMapProps {
  activities: Record<string, boolean>
  expanded: boolean
}

export function HeatMap({ activities, expanded }: HeatMapProps) {
  const days = expanded ? 240 : 120
  const dates = useMemo(() => generateDates(days), [days])

  const weeks = useMemo(() => {
    const result: string[][] = []
    let currentWeek: string[] = []

    dates.forEach((date, i) => {
      const dayOfWeek = new Date(date + "T12:00:00").getDay()
      if (i === 0) {
        for (let j = 0; j < dayOfWeek; j++) {
          currentWeek.push("")
        }
      }
      currentWeek.push(date)
      if (dayOfWeek === 6 || i === dates.length - 1) {
        result.push(currentWeek)
        currentWeek = []
      }
    })

    return result
  }, [dates])

  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = []
    let lastMonth = -1
    weeks.forEach((week, weekIndex) => {
      const validDate = week.find((d) => d !== "")
      if (validDate) {
        const month = new Date(validDate + "T12:00:00").getMonth()
        if (month !== lastMonth) {
          lastMonth = month
          labels.push({
            label: new Date(validDate + "T12:00:00").toLocaleString("en-US", {
              month: "short",
            }),
            weekIndex,
          })
        }
      }
    })
    return labels
  }, [weeks])

  const cellSize = expanded ? 10 : 8
  const gap = 2
  const colWidth = cellSize + gap

  return (
    <div className="flex flex-col gap-1.5">
      {/* Month labels */}
      <div className="relative h-4">
        {monthLabels.map((m, i) => (
          <span
            key={i}
            className="absolute text-[9px] font-mono text-muted-foreground"
            style={{ left: `${m.weekIndex * colWidth}px` }}
          >
            {m.label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="flex" style={{ gap: `${gap}px` }}>
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="flex flex-col"
            style={{ gap: `${gap}px` }}
          >
            {week.map((date, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                style={{ width: cellSize, height: cellSize }}
                className={`rounded-[2px] ${
                  !date
                    ? "bg-transparent"
                    : activities[date]
                      ? "bg-foreground"
                      : "bg-secondary"
                }`}
                title={
                  date
                    ? `${date}: ${activities[date] ? "Done" : "Not done"}`
                    : ""
                }
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      {expanded && (
        <div className="flex items-center justify-end gap-1.5 pt-0.5">
          <span className="text-[9px] font-mono text-muted-foreground mr-0.5">
            Less
          </span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-secondary" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-muted-foreground/30" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-muted-foreground/60" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-foreground" />
          <span className="text-[9px] font-mono text-muted-foreground ml-0.5">
            More
          </span>
        </div>
      )}
    </div>
  )
}
