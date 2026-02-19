import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns a Tailwind text color class based on completion percentage. */
export function progressColor(percent: number): string {
  if (percent === 0) return "text-transparent"
  if (percent < 50) return "text-red-500"
  if (percent < 100) return "text-amber-500"
  return "text-green-500"
}
