"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check } from "lucide-react"
import { type Habit, HABIT_PRESETS, DAY_LABELS } from "@/lib/habit-types"

interface CreateHabitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateHabit: (habit: Omit<Habit, "id" | "activities">) => void
}

export function CreateHabitDialog({
  open,
  onOpenChange,
  onCreateHabit,
}: CreateHabitDialogProps) {
  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("")
  const [repeat, setRepeat] = useState<"daily" | "weekly" | "monthly">("daily")
  const [selectedDays, setSelectedDays] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ])
  const [remindMe, setRemindMe] = useState(false)
  const [isPublic, setIsPublic] = useState(true)

  const resetForm = () => {
    setName("")
    setEmoji("")
    setRepeat("daily")
    setSelectedDays([true, true, true, true, true, true, true])
    setRemindMe(false)
    setIsPublic(true)
  }

  const handleSelectPreset = (preset: { emoji: string; name: string }) => {
    setName(preset.name)
    setEmoji(preset.emoji)
  }

  const toggleDay = (index: number) => {
    setSelectedDays((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const handleCreate = () => {
    if (!name.trim()) return
    onCreateHabit({
      name: name.trim(),
      emoji: emoji || "\u2B50",
      repeat,
      selectedDays,
      remindMe,
      isPublic,
    })
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-base font-semibold">
            Create a new habit
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Define your habit, set a schedule, and start tracking.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 flex flex-col gap-5">
          {/* Name input */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">My new habit...</Label>
            <Input
              placeholder="Type here or choose below"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
            {HABIT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                  name === preset.name
                    ? "border-foreground bg-accent text-accent-foreground font-medium"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <span>{preset.emoji}</span>
                <span>{preset.name}</span>
              </button>
            ))}
          </div>

          {/* Repeat selector */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Repeat</Label>
            <Select
              value={repeat}
              onValueChange={(v) =>
                setRepeat(v as "daily" | "weekly" | "monthly")
              }
            >
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Day toggles */}
          <div className="flex items-center justify-center gap-2">
            {DAY_LABELS.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleDay(index)}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                    selectedDays[index]
                      ? "border-foreground bg-foreground/10"
                      : "border-border"
                  }`}
                >
                  {selectedDays[index] && (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  )}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {day}
                </span>
              </button>
            ))}
          </div>

          {/* Switches */}
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="remind" className="text-sm font-medium">
                Remind me to tick
              </Label>
              <Switch id="remind" checked={remindMe} onCheckedChange={setRemindMe} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="public" className="text-sm font-medium">
                Users can see my progress
              </Label>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>

          {/* Create button */}
          <Button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="w-full h-11 text-sm font-semibold uppercase tracking-wide"
          >
            Create Habit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
