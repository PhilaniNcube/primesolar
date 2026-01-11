import { SolarPanelDetailClient } from "@/components/admin/solar-panel-detail-client"
import { getSolarPanelById } from "@/dal/queries/solar-panels"


type Params = Promise<{ id: string }>

export default async function SolarPanelDetailPage({ params }: { params: Params }) {
  const { id } = await params

  const panel = await getSolarPanelById(id)

  if (!panel) {
    return <SolarPanelDetailClient panel={null} />
  }

  return <SolarPanelDetailClient panel={panel} />
}
