import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center gap-4 px-4">
      <p className="text-6xl font-bold text-muted-foreground/30">404</p>
      <h1 className="text-xl font-semibold text-foreground">Page not found</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild size="sm">
        <Link href="/">Go home</Link>
      </Button>
    </main>
  )
}
