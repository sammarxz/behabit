"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto max-w-lg px-4 py-6 flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} size="sm">
        Try again
      </Button>
    </main>
  )
}
