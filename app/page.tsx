import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import Image from "next/image"
import { DemoHabits } from "@/components/demo-habits"
import { ChevronRight } from "lucide-react"
import { Logo } from "@/components/logo"
export const metadata: Metadata = {
  title: "BeHabit - Build Better Habits",
  description:
    "A minimal habit tracker with streaks, heatmaps, and public profiles to keep you accountable.",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-8 z-50 mx-auto w-fit">
        <Logo href="/" />
      </header>
      {/* Hero */}
      <main className="overflow-hidden">
        <section className="bg-background">
          <div className="relative pb-32 pt-44">
            <div className="mask-radial-from-45% mask-radial-to-75% mask-radial-at-top mask-radial-[75%_100%] mask-t-from-50% aspect-2/3 lg:aspect-9/4 absolute inset-0 md:aspect-square dark:opacity-5">
              <Image
                src="https://images.unsplash.com/photo-1740516367177-ae20098c8786?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="hero background"
                width={2268}
                height={1740}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
              <div className="relative mx-auto w-full flex items-center justify-center">
                <DemoHabits />
                <div className="pointer-events-none mask-radial-from-50% mask-radial-at-bottom mask-radial-[35%_100%] absolute -bottom-2 left-0 w-full h-full bg-linear-to-t from-[#0D0D0D] to-transparent" />
              </div>
              <div className="mx-auto max-w-lg text-center relative z-10">
                <h1 className="text-balance font-serif text-4xl font-medium sm:text-5xl">
                  Don't worry, be habit.
                </h1>
                <p className="text-muted-foreground mt-4 text-balance">
                  A minimal habit tracker designed to help you build consistency through streaks,
                  heatmaps, and public accountability.
                </p>
                <Button asChild variant="outline" size="lg" className="mt-6 pr-1.5">
                  <Link href="/login">
                    <span className="text-nowrap">Get Started</span>
                    <ChevronRight className="opacity-50" />
                  </Link>
                </Button>
                <div className="bg-[#0D0D0D] h-72 w-72 rounded-full absolute inset-0 -top-16 mx-auto blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="">
        <div className="mx-auto max-w-4xl px-4 py-6 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            Developed with ❤️ by{" "}
            <a
              href="https://github.com/sammarxz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium"
            >
              sammarxz
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
