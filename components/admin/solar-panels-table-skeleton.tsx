import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SolarPanelsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-50" />
        <Skeleton className="h-4 w-75 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-20" />
                <Skeleton className="h-12 w-24" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
