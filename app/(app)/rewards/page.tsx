"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, Trophy, PackageCheck } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RewardCard } from "@/components/reward-card"
import { RewardDrawer } from "@/components/reward-drawer"
import {
  useRewards,
  useCreateReward,
  useUpdateReward,
  useDeleteReward,
  useRedeemReward,
} from "@/lib/api/hooks/use-rewards"
import { useHabits } from "@/lib/api/hooks/use-habits"
import { calculateTotalXP, calculateSpentXP } from "@/lib/shared/types"
import { toast } from "sonner"
import type { Reward } from "@/lib/shared/types"
import { useSound } from "@/hooks/use-sound"
import { useConfetti } from "@/hooks/use-confetti"

const TABS = ["available", "redeemed"] as const
type TabValue = (typeof TABS)[number]

const tabVariants = {
  enter: (d: number) => ({ x: d * 32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -32, opacity: 0 }),
}

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("available")
  const [direction, setDirection] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)

  function handleTabChange(value: string) {
    const oldIdx = TABS.indexOf(activeTab)
    const newIdx = TABS.indexOf(value as TabValue)
    setDirection(newIdx > oldIdx ? 1 : -1)
    setActiveTab(value as TabValue)
  }

  const { data: rewards, isLoading: rewardsLoading } = useRewards()
  const { data: habits, isLoading: habitsLoading } = useHabits()

  const createReward = useCreateReward()
  const updateReward = useUpdateReward()
  const deleteReward = useDeleteReward()
  const redeemReward = useRedeemReward()
  const { play } = useSound()
  const { fireRewardRedeem } = useConfetti()

  const isLoading = rewardsLoading || habitsLoading

  const earnedXP = calculateTotalXP(habits ?? [])
  const spentXP = calculateSpentXP(rewards ?? [])
  const currentXP = earnedXP - spentXP

  const availableRewards = rewards?.filter((r) => !r.isRedeemed) ?? []
  const redeemedRewards = rewards?.filter((r) => r.isRedeemed) ?? []

  const openCreate = () => {
    setEditingReward(null)
    setDrawerOpen(true)
  }

  const openEdit = (reward: Reward) => {
    setEditingReward(reward)
    setDrawerOpen(true)
  }

  const handleSave = (
    data: Omit<Reward, "id" | "emoji" | "isRedeemed" | "redeemedAt" | "createdAt" | "updatedAt">
  ) => {
    if (editingReward) {
      updateReward.mutate(
        { rewardId: editingReward.id, ...data },
        {
          onSuccess: () => toast.success("Reward updated"),
          onError: (err) => toast.error(err.message),
        }
      )
    } else {
      createReward.mutate(data, {
        onSuccess: () => toast.success("Reward created"),
        onError: (err) => toast.error(err.message),
      })
    }
  }

  const handleDelete = (rewardId: string) => {
    deleteReward.mutate(rewardId, {
      onSuccess: () => toast.success("Reward deleted"),
      onError: () => toast.error("Failed to delete reward"),
    })
  }

  const handleRedeem = (rewardId: string) => {
    redeemReward.mutate(rewardId, {
      onSuccess: () => {
        play("get-reward")
        fireRewardRedeem()
        toast.success("Reward redeemed! Well done 🎉")
      },
      onError: () => toast.error("Failed to redeem reward"),
    })
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-lg px-4 py-6 pb-28 flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </main>
    )
  }

  return (
    <>
      <main className="mx-auto max-w-lg px-4 py-6 pb-28 flex flex-col gap-6">
        {/* Page heading */}
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-semibold text-foreground">My Rewards</h1>
          <p className="text-sm text-muted-foreground">
            You have <span className="font-mono font-medium text-foreground">{currentXP} XP</span>{" "}
            available
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="available" className="flex-1 gap-2">
              Available
              {availableRewards.length > 0 && (
                <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-[10px] font-medium leading-none tabular-nums">
                  {availableRewards.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="redeemed" className="flex-1 gap-2">
              Redeemed
              {redeemedRewards.length > 0 && (
                <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-[10px] font-medium leading-none tabular-nums">
                  {redeemedRewards.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={activeTab}
                custom={direction}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className="mt-4"
              >
                {activeTab === "available" &&
                  (availableRewards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                        <Trophy className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-sm font-medium text-card-foreground mb-1">
                        No rewards yet
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                        Create a reward to motivate yourself. Earn XP by completing habits and
                        redeem when you hit the goal.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {availableRewards.map((reward) => (
                        <RewardCard
                          key={reward.id}
                          reward={reward}
                          currentXP={currentXP}
                          onRedeem={handleRedeem}
                          onEdit={openEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  ))}

                {activeTab === "redeemed" &&
                  (redeemedRewards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                        <PackageCheck className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-sm font-medium text-card-foreground mb-1">
                        Nothing redeemed yet
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                        Earn XP, create rewards and redeem them when you reach your goal.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {redeemedRewards.map((reward) => (
                        <RewardCard
                          key={reward.id}
                          reward={reward}
                          currentXP={currentXP}
                          onRedeem={handleRedeem}
                          onEdit={openEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>

        <RewardDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onSave={handleSave}
          reward={editingReward}
        />
      </main>

      {/* FAB */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md">
        <div className="w-full flex justify-center max-w-lg mx-auto">
          <Button onClick={openCreate} size="lg" variant="outline" className="w-full">
            <Plus className="h-6 w-6" />
            New Reward
          </Button>
        </div>
      </div>
    </>
  )
}
