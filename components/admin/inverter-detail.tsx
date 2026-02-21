import { getInverterById } from "@/dal/queries/inverters"
import { notFound } from "next/navigation"
import { InverterDetailClient } from "./inverter-detail-client"

type InverterDetailProps = {
  params: Promise<{ id: string }>
}

export async function InverterDetail({ params }: InverterDetailProps) {
  const { id } = await params

  const inverter = await getInverterById(id)

  if (!inverter) {
    return notFound()
  }

  return <InverterDetailClient inverter={inverter} />
}
