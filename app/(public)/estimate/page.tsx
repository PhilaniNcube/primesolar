import { Suspense } from "react"
import { SolarConfigurator } from "@/components/solar-configurator"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metadata } from "next"
import { getSolarPanels } from "@/dal/queries/solar-panels"
import { getBatteries } from "@/dal/queries/batteries"
import { getInverters } from "@/dal/queries/inverters"
import { cacheLife } from "next/cache"

interface EstimatePageProps {
  searchParams: Promise<{
    place_id?: string
    address?: string
  }>
}

// Cached catalog fetch — runs once and is reused across all requests.
// Separated from the page so it doesn't share scope with the runtime
// `searchParams` access (required by the Cache Components rules).
async function getCatalogData() {
  "use cache"
  cacheLife("days")
  const [dbPanels, dbBatteries, dbInverters] = await Promise.all([
    getSolarPanels(),
    getBatteries(),
    getInverters(),
  ])
  return { dbPanels, dbBatteries, dbInverters }
}

export async function generateMetadata({ searchParams }: EstimatePageProps): Promise<Metadata> {
  const params = await searchParams
  const address = params.address ? decodeURIComponent(params.address) : ""
  
  return {
    title: address ? `Solar Estimate for ${address}` : 'Get Your Solar Estimate',
    description: `Customize your solar panel system for ${address || 'your location'}. Configure panels, batteries, and BMS to calculate costs, savings, and environmental impact.`,
    openGraph: {
      title: address ? `Solar Estimate for ${address}` : 'Get Your Solar Estimate',
      description: `Customize your solar panel system and calculate your savings with PrimeSolar.`,
      url: 'https://primesolar.co.za/estimate',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://primesolar.co.za/estimate',
    },
  }
}

export default function EstimatePage({ searchParams }: EstimatePageProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        <Suspense fallback={<ConfiguratorSkeleton />}>
          <EstimateContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  )
}

async function EstimateContent({ searchParams }: { searchParams: EstimatePageProps["searchParams"] }) {
  const params = await searchParams
  const placeId = params.place_id || ""
  const address = params.address ? decodeURIComponent(params.address) : ""

  const { dbPanels, dbBatteries, dbInverters } = await getCatalogData()

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Your Solar Estimate</h1>
        {address && (
          <p className="mt-2 text-muted-foreground">
            Analyzing solar potential for: <span className="text-foreground font-medium">{address}</span>
          </p>
        )}
      </div>

      <SolarConfigurator
        placeId={placeId}
        address={address}
        dbPanels={dbPanels}
        dbBatteries={dbBatteries}
        dbInverters={dbInverters}
      />
    </>
  )
}

function ConfiguratorSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-75 w-full rounded-xl" />
        <Skeleton className="h-50 w-full rounded-xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-100 w-full rounded-xl" />
      </div>
    </div>
  )
}