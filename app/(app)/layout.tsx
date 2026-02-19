"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "@/lib/api/hooks/use-auth"
import { SiteHeader } from "@/components/site-header"
import { toast } from "sonner"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  React.useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [session, isPending, router])

  React.useEffect(() => {
    if (!isPending && session?.user) {
      const user = session.user as typeof session.user & { username?: string | null }
      if (!user.username && !pathname.startsWith("/settings")) {
        const toastKey = "username-prompt-shown"
        if (!sessionStorage.getItem(toastKey)) {
          sessionStorage.setItem(toastKey, "1")
          toast.info("Complete your profile", {
            description: "Set a username to enable your public profile.",
            action: {
              label: "Go to Settings",
              onClick: () => router.push("/settings"),
            },
            duration: 8000,
          })
        }
      }
    }
  }, [isPending, session, pathname, router])

  if (isPending || !session?.user) return null

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {children}
    </div>
  )
}
