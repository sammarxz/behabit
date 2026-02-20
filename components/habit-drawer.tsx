"use client"

import React from "react"
import { Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Check, Zap } from "lucide-react"
import { type Habit, HABIT_PRESETS, DAY_LABELS } from "@/lib/shared/types"
import { useHabitForm } from "@/hooks/use-habit-form"
import { toast } from "sonner"
import {
  TimePicker,
  TimePickerContent,
  TimePickerHour,
  TimePickerInput,
  TimePickerInputGroup,
  TimePickerLabel,
  TimePickerMinute,
  TimePickerPeriod,
  TimePickerSeparator,
  TimePickerTrigger,
} from "@/components/ui/time-picker"

const XP_OPTIONS = [5, 10, 15, 20, 25, 50]

interface HabitDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (habit: Omit<Habit, "id" | "activities" | "createdAt">) => void
  habit?: Habit | null
}

export function HabitDrawer({ open, onOpenChange, onSave, habit }: HabitDrawerProps) {
  const { form, isEditing, handleSelectPreset } = useHabitForm(habit, open)

  const watchedEmoji = form.watch("emoji")
  const watchedName = form.watch("name")
  const watchedRemindMe = form.watch("remindMe")
  const watchedSelectedDays = form.watch("selectedDays")
  const watchedXpPerCheck = form.watch("xpPerCheck")

  const handleSubmit = form.handleSubmit((data) => {
    let finalName = data.name.trim()
    let finalEmoji = data.emoji

    try {
      const emojiRegex = new RegExp("^(\\p{RGI_Emoji})\\s*", "v")
      const match = finalName.match(emojiRegex)
      if (match) {
        finalEmoji = match[1]
        finalName = finalName.slice(match[0].length).trim() || "My Habit"
      }
    } catch (e) {
      try {
        const fallbackRegex = new RegExp(
          "^(\\p{Extended_Pictographic}|\\p{Emoji_Presentation})\\s*",
          "u"
        )
        const match = finalName.match(fallbackRegex)
        if (match) {
          finalEmoji = match[1]
          finalName = finalName.slice(match[0].length).trim() || "My Habit"
        }
      } catch (err) {}
    }

    onSave({
      name: finalName,
      emoji: finalEmoji,
      repeat: data.repeat,
      selectedDays: data.selectedDays,
      remindMe: data.remindMe,
      reminderTime: data.remindMe ? data.reminderTime : null,
      xpPerCheck: data.xpPerCheck,
      isPublic: data.isPublic,
    })
    onOpenChange(false)
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Add new habit</DrawerTitle>
          <DrawerDescription>
            Create a new habit to track your progress and build consistency.
          </DrawerDescription>
        </DrawerHeader>
        <div className="mx-auto w-full max-w-lg overflow-y-auto pt-6">
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="px-6 pb-8 flex flex-col gap-5">
                {/* Name input */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">My new habit...</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type here or choose below"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {HABIT_PRESETS.map((preset) => {
                    const isSelected = watchedEmoji === preset.emoji && watchedName === preset.name
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "border-foreground bg-accent text-accent-foreground font-medium"
                            : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <span>{preset.emoji}</span>
                        <span>{preset.name}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Day toggles */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Repeat on</Label>
                  <Controller
                    control={form.control}
                    name="selectedDays"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        {DAY_LABELS.map((day, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              const next = [...field.value]
                              next[index] = !next[index]
                              field.onChange(next)
                            }}
                            className="flex flex-col items-center gap-1.5 cursor-pointer"
                          >
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                                watchedSelectedDays[index]
                                  ? "border-foreground bg-foreground/10"
                                  : "border-border"
                              }`}
                            >
                              {watchedSelectedDays[index] && (
                                <Check className="h-3.5 w-3.5 text-foreground" />
                              )}
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground">
                              {day}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                {/* XP per check */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">XP per check</Label>
                  <Controller
                    control={form.control}
                    name="xpPerCheck"
                    render={({ field }) => (
                      <div className="flex items-center gap-1.5">
                        {XP_OPTIONS.map((xp) => (
                          <button
                            key={xp}
                            type="button"
                            onClick={() => field.onChange(xp)}
                            className={`flex-1 h-9 rounded-md border text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                              watchedXpPerCheck === xp
                                ? "border-foreground bg-foreground/10 text-foreground"
                                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                          >
                            <Zap className="w-3 h-3" />
                            {xp}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                {/* Switches */}
                <div className="flex flex-col gap-3 pt-1">
                  {/* Remind me */}
                  <div className="flex flex-col gap-2">
                    <Controller
                      control={form.control}
                      name="remindMe"
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <Label htmlFor="remind" className="text-sm font-medium">
                            Remind me to tick
                          </Label>
                          <Switch
                            id="remind"
                            checked={field.value}
                            onCheckedChange={async (checked) => {
                              if (checked && Notification.permission === "default") {
                                const permission = await Notification.requestPermission()
                                if (permission !== "granted") {
                                  toast.warning(
                                    "Enable notifications in your browser to use reminders."
                                  )
                                  return
                                }
                              } else if (checked && Notification.permission === "denied") {
                                toast.warning(
                                  "Notifications are blocked. Enable them in your browser settings."
                                )
                                return
                              }
                              field.onChange(checked)
                            }}
                          />
                        </div>
                      )}
                    />
                    {watchedRemindMe && (
                      <FormField
                        control={form.control}
                        name="reminderTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-2 w-full">
                                <TimePicker
                                  value={field.value ?? "09:00"}
                                  onValueChange={field.onChange}
                                >
                                  <TimePickerLabel>Select Time</TimePickerLabel>
                                  <TimePickerInputGroup>
                                    <TimePickerInput segment="hour" />
                                    <TimePickerSeparator />
                                    <TimePickerInput segment="minute" />
                                    <TimePickerInput segment="period" />
                                    <TimePickerTrigger />
                                  </TimePickerInputGroup>
                                  <TimePickerContent>
                                    <TimePickerHour />
                                    <TimePickerMinute />
                                    <TimePickerPeriod />
                                  </TimePickerContent>
                                </TimePicker>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Public */}
                  <Controller
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <Label htmlFor="public" className="text-sm font-medium">
                          Users can see my progress
                        </Label>
                        <Switch
                          id="public"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="w-full "
                >
                  {isEditing ? "Save Changes" : "Create Habit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
