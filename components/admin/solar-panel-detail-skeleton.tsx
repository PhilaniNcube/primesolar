import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function SolarPanelDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Specs Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
                  <Skeleton className="size-9 rounded-md shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div>
              <Skeleton className="mb-4 h-5 w-40" />
              <div className="grid gap-4 sm:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Info */}
        <div className="space-y-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-5 w-28" />
              </div>
              <Separator />
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Separator />
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-48 rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Image Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-square w-full rounded-lg" />
            </CardContent>
          </Card>

          {/* Record History */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Separator />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
