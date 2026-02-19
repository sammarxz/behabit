import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Profile header */}
          <div className="px-6 py-8 flex flex-col items-center gap-3">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>

          {/* Stats + habits card */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-2 py-5 ${i === 1 ? "border-x border-border" : ""}`}
                >
                  <Skeleton className="h-6 w-10" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex flex-col">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  {i > 0 && <Separator />}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-7 w-7 rounded-md shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
