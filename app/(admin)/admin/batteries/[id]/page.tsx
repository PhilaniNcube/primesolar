import { BatteryDetail } from "@/components/admin/battery-detail";
import { BatteryDetailSkeleton } from "@/components/admin/battery-detail-skeleton";
import { Suspense } from "react";

type Params = Promise<{ id: string }>;

export default function BatteryDetailPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<BatteryDetailSkeleton />}>
      <BatteryDetail params={params} />
    </Suspense>
  );
}
