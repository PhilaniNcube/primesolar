import { getBatteries } from '@/dal/queries/batteries'
import { BatteriesClient } from './batteries-client'

const BatteriesWrapper = async () => {
  const batteries = await getBatteries()

  return <BatteriesClient initialBatteries={batteries} />
}

export default BatteriesWrapper