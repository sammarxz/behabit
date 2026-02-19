import { useCallback } from "react"

type SoundName = "check" | "success-day" | "get-reward"

const SOUNDS: Record<SoundName, string> = {
  check: "/audios/success.mp3",
  "success-day": "/audios/success-day.mp3",
  "get-reward": "/audios/get-reward.mp3",
}

export function useSound() {
  const play = useCallback((sound: SoundName) => {
    if (typeof window === "undefined") return
    const audio = new Audio(SOUNDS[sound])
    audio.play().catch(() => {})
  }, [])

  return { play }
}
