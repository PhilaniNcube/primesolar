import { Skeleton } from "@/components/ui/skeleton"

export function HeaderAuthFallback({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-24" />
    </div>
  )
}
