import { SolarPanelDetail } from "@/components/admin/solar-panel-detail"
import { SolarPanelDetailSkeleton } from "@/components/admin/solar-panel-detail-skeleton"
import { Suspense } from "react"

type Params = Promise<{ id: string }>

export default function SolarPanelDetailPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<SolarPanelDetailSkeleton />}>
      <SolarPanelDetail params={params} />
    </Suspense>
  )
}
