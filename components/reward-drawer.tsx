"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Zap } from "lucide-react"
import { createRewardSchema } from "@/lib/shared/schemas/reward.schema"
import type { Reward } from "@/lib/shared/types"

const rewardFormSchema = createRewardSchema.omit({ emoji: true })
type RewardFormValues = z.infer<typeof rewardFormSchema>

interface RewardDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (
    data: Omit<Reward, "id" | "emoji" | "isRedeemed" | "redeemedAt" | "createdAt" | "updatedAt">
  ) => void
  reward?: Reward | null
}

export function RewardDrawer({ open, onOpenChange, onSave, reward }: RewardDrawerProps) {
  const isEditing = !!reward

  const form = useForm<RewardFormValues>({
    resolver: zodResolver(rewardFormSchema),
    defaultValues: {
      title: "",
      description: null,
      xpRequired: 100,
    },
  })

  useEffect(() => {
    if (open && reward) {
      form.reset({
        title: reward.title,
        description: reward.description,
        xpRequired: reward.xpRequired,
      })
    } else if (!open) {
      form.reset({
        title: "",
        description: null,
        xpRequired: 100,
      })
    }
  }, [reward, open]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = form.handleSubmit((data) => {
    onSave({
      title: data.title,
      description: data.description,
      xpRequired: data.xpRequired,
    })
    onOpenChange(false)
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-lg overflow-y-auto pt-6">
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="px-6 pb-8 flex flex-col gap-5">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Reward title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Buy a book, Gaming day..."
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Description{" "}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any notes about this reward..."
                          className="resize-none"
                          rows={2}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* XP Required */}
                <FormField
                  control={form.control}
                  name="xpRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">XP required</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={1}
                            placeholder="100"
                            className="h-10 pl-9"
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 text-sm font-semibold uppercase tracking-wide"
                >
                  {isEditing ? "Save Changes" : "Create Reward"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
