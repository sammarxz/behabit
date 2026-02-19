import { Skeleton } from "@/components/ui/skeleton"

export default function AppLoading() {
  return (
    <main className="mx-auto max-w-lg px-4 py-6 pb-28 flex flex-col gap-8">
      {/* WeekStrip skeleton */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
        <div className="flex items-center">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <Skeleton className="h-2 w-5" />
              <Skeleton className="h-[34px] w-[34px] rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* My Habits card skeleton */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-[52px] w-[52px] rounded-full shrink-0" />
        </div>
        <div className="px-4 flex flex-col gap-1.5 pb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-foreground/5 border border-border/50 rounded-lg p-4 flex items-center gap-3"
            >
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-7 w-7 rounded-md shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
