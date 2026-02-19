import { useCallback } from "react"
import confetti from "canvas-confetti"

export function useConfetti() {
  const fireHabitCheck = useCallback((origin: { x: number; y: number }) => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin,
      colors: ["#a3e635", "#86efac", "#6ee7b7"],
      scalar: 0.9,
      gravity: 1.2,
      ticks: 150,
    })
  }, [])

  const fireRewardRedeem = useCallback(() => {
    const end = Date.now() + 1500

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#fcd34d"],
      })
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#fcd34d"],
      })

      if (Date.now() < end) requestAnimationFrame(frame)
    }

    frame()
  }, [])

  return { fireHabitCheck, fireRewardRedeem }
}
