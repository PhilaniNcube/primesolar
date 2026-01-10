import { Suspense } from "react"
import { SolarConfigurator } from "@/components/solar-configurator"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metadata } from "next"

interface EstimatePageProps {
  searchParams: Promise<{
    place_id?: string
    address?: string
  }>
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

export default async function EstimatePage({ searchParams }: EstimatePageProps) {
  const params = await searchParams
  const placeId = params.place_id || ""
  const address = params.address ? decodeURIComponent(params.address) : ""

  return (
    <main className="min-h-screen bg-background">
   
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Your Solar Estimate</h1>
          {address && (
            <p className="mt-2 text-muted-foreground">
              Analyzing solar potential for: <span className="text-foreground font-medium">{address}</span>
            </p>
          )}
        </div>

        <Suspense fallback={<ConfiguratorSkeleton />}>
          <SolarConfigurator placeId={placeId} address={address} />
        </Suspense>
      </div>
  
    </main>
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