"use client"

import React, { useMemo } from "react"
import { generateDates } from "@/lib/shared/types"

interface HeatMapProps {
  activities: Record<string, boolean>
  expanded: boolean
}

export function HeatMap({ activities, expanded }: HeatMapProps) {
  const days = expanded ? 365 : 120
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

  // SVG logical units — viewBox scales to fill container width
  const cellSize = 10
  const gap = 2
  const colWidth = cellSize + gap
  const labelHeight = 14

  const svgWidth = weeks.length * colWidth - gap
  const svgHeight = labelHeight + 7 * colWidth - gap

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width="100%"
        preserveAspectRatio="xMinYMid meet"
        aria-label="Activity heatmap"
      >
        {/* Month labels */}
        {monthLabels.map((m) => (
          <text
            key={`${m.weekIndex}-${m.label}`}
            x={m.weekIndex * colWidth}
            y={10}
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              fill: "var(--muted-foreground)",
            }}
          >
            {m.label}
          </text>
        ))}

        {/* Grid */}
        <g transform={`translate(0, ${labelHeight})`}>
          {weeks.map((week, weekIndex) =>
            week.map((date, dayIndex) => (
              <rect
                key={`${weekIndex}-${dayIndex}`}
                x={weekIndex * colWidth}
                y={dayIndex * colWidth}
                width={cellSize}
                height={cellSize}
                rx={1.5}
                style={{
                  fill: !date
                    ? "transparent"
                    : activities[date]
                      ? "var(--foreground)"
                      : "var(--secondary)",
                }}
              >
                {date && (
                  <title>
                    {date}: {activities[date] ? "Done" : "Not done"}
                  </title>
                )}
              </rect>
            ))
          )}
        </g>
      </svg>

      {/* Legend
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
      )} */}
    </div>
  )
}
