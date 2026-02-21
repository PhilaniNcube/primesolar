import { getSolarPanelById } from "@/dal/queries/solar-panels"
import { notFound } from "next/navigation"
import { SolarPanelDetailClient } from "./solar-panel-detail-client"

type SolarPanelDetailProps = {
  params: Promise<{ id: string }>
}

export async function SolarPanelDetail({ params }: SolarPanelDetailProps) {
  const { id } = await params

  const panel = await getSolarPanelById(id)

  if (!panel) {
    return notFound()
  }

  return <SolarPanelDetailClient panel={panel} />
}
