import { getInverters } from "@/dal/queries/inverters"
import { InvertersClient } from "./inverters-client"

const InvertersWrapper = async () => {
  const inverters = await getInverters()

  return <InvertersClient initialInverters={inverters} />
}

export default InvertersWrapper
