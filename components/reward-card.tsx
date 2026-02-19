"use client"

import { Pencil, Trash2, CheckCircle2, Lock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Reward } from "@/lib/shared/types"

interface RewardCardProps {
  reward: Reward
  currentXP: number
  onRedeem: (id: string) => void
  onEdit: (reward: Reward) => void
  onDelete: (id: string) => void
}

export function RewardCard({ reward, currentXP, onRedeem, onEdit, onDelete }: RewardCardProps) {
  const progress = Math.min((currentXP / reward.xpRequired) * 100, 100)
  const isAvailable = !reward.isRedeemed && currentXP >= reward.xpRequired

  return (
    <div
      className={`bg-card border rounded-2xl p-5 flex flex-col gap-4 transition-colors ${
        reward.isRedeemed
          ? "border-border/50 opacity-70"
          : isAvailable
            ? "border-foreground/30"
            : "border-border/50"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-card-foreground leading-snug">
              {reward.title}
            </h3>
            {reward.description && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {reward.description}
              </p>
            )}
          </div>
        </div>

        {/* Edit/Delete — only when not redeemed */}
        {!reward.isRedeemed && (
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(reward)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(reward.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Progress + XP label */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>
              {Math.min(currentXP, reward.xpRequired)}/{reward.xpRequired} XP
            </span>
          </div>
          {reward.isRedeemed ? (
            <span className="text-xs text-muted-foreground">
              Redeemed {reward.redeemedAt ? new Date(reward.redeemedAt).toLocaleDateString() : ""}
            </span>
          ) : isAvailable ? (
            <span className="text-xs font-medium text-foreground">Ready to redeem!</span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {reward.xpRequired - currentXP} XP to go
            </span>
          )}
        </div>
        <Progress
          value={progress}
          className={`h-1.5 ${isAvailable && !reward.isRedeemed ? "[&>div]:bg-foreground" : ""}`}
        />
      </div>

      {/* Status / Action */}
      {reward.isRedeemed ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>Redeemed</span>
        </div>
      ) : isAvailable ? (
        <Button
          size="sm"
          className="w-full h-9 text-xs font-semibold uppercase tracking-wide"
          onClick={() => onRedeem(reward.id)}
        >
          Redeem Reward
        </Button>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          <span>Keep completing habits to unlock</span>
        </div>
      )}
    </div>
  )
}
