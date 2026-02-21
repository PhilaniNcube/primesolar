import { InverterDetail } from "@/components/admin/inverter-detail"
import { InverterDetailSkeleton } from "@/components/admin/inverter-detail-skeleton"
import { Suspense } from "react"

type Params = Promise<{ id: string }>

export default function InverterDetailPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<InverterDetailSkeleton />}>
      <InverterDetail params={params} />
    </Suspense>
  )
}
