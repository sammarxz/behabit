"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion"
import type { Habit } from "@/lib/shared/types"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Gauge,
  GaugeIndicator,
  GaugeTrack,
  GaugeRange,
  GaugeValueText,
} from "@/components/ui/gauge"
import { useWeekStrip } from "@/hooks/use-week-strip"
import { progressColor } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface WeekStripProps {
  habits: Habit[]
  selectedDate: string
  onSelectDate: (date: string) => void
  weekOffset: number
  onPrevWeek: () => void
  onNextWeek: () => void
  onJumpToDate: (date: Date) => void
}

const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
}

export function WeekStrip({
  habits,
  selectedDate,
  onSelectDate,
  weekOffset,
  onPrevWeek,
  onNextWeek,
  onJumpToDate,
}: WeekStripProps) {
  const [direction, setDirection] = useState(0)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const isMobile = useIsMobile()
  const daysToShow = isMobile ? 7 : 9

  const { weekDays, todayStr, isCurrentWeek, weekRangeLabel, getCompletionProgress } = useWeekStrip(
    habits,
    weekOffset,
    daysToShow
  )

  // Sync animation direction when weekOffset changes externally (e.g., calendar jump)
  const prevWeekOffsetRef = React.useRef(weekOffset)
  React.useEffect(() => {
    if (weekOffset !== prevWeekOffsetRef.current) {
      setDirection(weekOffset > prevWeekOffsetRef.current ? 1 : -1)
      prevWeekOffsetRef.current = weekOffset
    }
  }, [weekOffset])

  const handlePrevWeek = () => {
    setDirection(-1)
    onPrevWeek()
  }

  const handleNextWeek = () => {
    if (isCurrentWeek) return
    setDirection(1)
    onNextWeek()
  }

  const handleCalendarSelect = (day: Date | undefined) => {
    if (!day) return
    onJumpToDate(day)
    setCalendarOpen(false)
  }

  const selectedDateObj = selectedDate ? new Date(selectedDate + "T12:00:00") : undefined

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <button
          onClick={handlePrevWeek}
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-accent"
              aria-label="Select week"
            >
              {weekRangeLabel}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDateObj}
              onSelect={handleCalendarSelect}
              disabled={{ after: new Date() }}
              defaultMonth={selectedDateObj}
            />
          </PopoverContent>
        </Popover>

        <button
          onClick={handleNextWeek}
          disabled={isCurrentWeek}
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
          aria-label="Next week"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-hidden">
        <LazyMotion features={domAnimation}>
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <m.div
              key={weekOffset}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", ease: "easeInOut" }}
              className="flex items-center"
            >
              {weekDays.map((date) => {
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
                    className={`flex-1 flex flex-col items-center gap-0.5 cursor-pointer transition-opacity disabled:opacity-30 disabled:cursor-default ${
                      isSelected ? "opacity-100" : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    <span
                      className={`text-[9px] font-medium mb-1 uppercase ${
                        isSelected
                          ? "text-foreground"
                          : isToday
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {dayLabels[date.getDay()]}
                    </span>

                    <Gauge value={progress} max={100} size={34} thickness={2}>
                      <GaugeIndicator>
                        <GaugeTrack className="text-border" />
                        <GaugeRange className={progressColor(progress)} />
                      </GaugeIndicator>
                      <GaugeValueText>
                        <div
                          className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                            isSelected ? "bg-foreground text-background" : ""
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      </GaugeValueText>
                    </Gauge>
                  </button>
                )
              })}
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </div>
    </div>
  )
}
