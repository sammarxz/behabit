"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "@/lib/api/hooks/use-auth"
import { useProfile } from "@/lib/api/hooks/use-profile"
import { useHabits } from "@/lib/api/hooks/use-habits"
import { useRewards } from "@/lib/api/hooks/use-rewards"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, User, Globe, LogOut, Trophy, Coffee } from "lucide-react"
import { calculateTotalXP, calculateSpentXP } from "@/lib/shared/types"
import { Logo } from "./logo"

interface SiteHeaderProps {
  maxWidth?: "lg" | "4xl"
}

export function SiteHeader({ maxWidth = "lg" }: SiteHeaderProps) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const isLoggedIn = !!session?.user

  const { data: profile } = useProfile({ enabled: isLoggedIn })
  const { data: habits } = useHabits({ enabled: isLoggedIn })
  const { data: rewards } = useRewards({ enabled: isLoggedIn })

  const totalXP = calculateTotalXP(habits ?? []) - calculateSpentXP(rewards ?? [])

  const userName = profile?.name || session?.user?.name || ""
  const userUsername = profile?.username || ""

  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const maxWidthClass = maxWidth === "4xl" ? "max-w-4xl" : "max-w-lg"

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md">
      <div className={`mx-auto ${maxWidthClass} px-4 flex h-14 items-center justify-between`}>
        <Logo href={isLoggedIn ? "/dashboard" : "/"} />

        {isPending ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ) : isLoggedIn ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
              <Star className="w-3 h-3 text-foreground" />
              <span className="text-xs font-mono font-medium text-foreground">{totalXP} XP</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer rounded-full ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar>
                    {profile?.image && <AvatarImage src={profile.image} />}
                    <AvatarFallback className="text-xs font-medium bg-secondary text-secondary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  {userUsername && <p className="text-xs text-muted-foreground">@{userUsername}</p>}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/rewards")}
                  className="cursor-pointer"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Rewards
                </DropdownMenuItem>
                {userUsername && (
                  <DropdownMenuItem
                    onClick={() => router.push(`/${userUsername}`)}
                    className="cursor-pointer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Public Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => window.open("https://buymeacoffee.com/smarxz", "_blank")}
                  className="cursor-pointer"
                >
                  <Coffee className="mr-2 h-4 w-4" />
                  Donate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button size="sm" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
