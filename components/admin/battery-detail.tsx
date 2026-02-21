import { getBatteryById } from "@/dal/queries/batteries"
import { notFound } from "next/navigation"
import { BatteryDetailClient } from "./battery-detail-client"

type BatteryDetailProps = {
  params: Promise<{ id: string }>
}

export async function BatteryDetail({ params }: BatteryDetailProps) {
  const { id } = await params

  const battery = await getBatteryById(id)

  if (!battery) {
    return notFound()
  }

  return <BatteryDetailClient battery={battery} />
}
