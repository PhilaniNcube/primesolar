/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Sun, MapPin, Maximize, Clock, AlertCircle } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import type { BuildingInsightsResponse } from "@/lib/types/solar"

interface SolarDataDisplayProps {
  solarData: BuildingInsightsResponse | undefined
  isLoading: boolean
  error: any
  address: string
}

export function SolarDataDisplay({ solarData, isLoading, error, address }: SolarDataDisplayProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 animate-pulse text-primary" />
            <CardTitle>Analyzing Solar Potential...</CardTitle>
          </div>
          <CardDescription>Fetching solar irradiation data for your location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>No Solar Data for This Address</CardTitle>
          </div>
          <CardDescription>
            We don&apos;t have solar data for this address. Google Solar API does not have imagery coverage for this
            location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Try searching for a nearby address, or contact us for a manual assessment.
          </p>
        </CardContent>
      </Card>
    )
  }

  const potential = solarData?.solarPotential

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            <CardTitle>Solar Analysis Results</CardTitle>
          </div>
          {solarData?.imageryQuality && <Badge variant="secondary">{solarData.imageryQuality} Quality Imagery</Badge>}
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sun className="h-4 w-4" />
              <span className="text-sm">Annual Sunshine</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">
              {potential?.maxSunshineHoursPerYear?.toLocaleString() || "~2,000"} hrs
            </div>
            <p className="text-xs text-muted-foreground">Peak sun hours per year</p>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Maximize className="h-4 w-4" />
              <span className="text-sm">Roof Area</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">
              {potential?.wholeRoofStats?.areaMeters2?.toFixed(0) || "~150"} m²
            </div>
            <p className="text-xs text-muted-foreground">Total usable roof space</p>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Max Panels</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{potential?.maxArrayPanelsCount || "~30"}</div>
            <p className="text-xs text-muted-foreground">Panels that fit on roof</p>
          </div>

          <div className="rounded-lg bg-primary/10 p-4">
            <div className="flex items-center gap-2 text-primary">
              <Sun className="h-4 w-4" />
              <span className="text-sm font-medium">Solar Rating</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-primary">
              {getSolarRating(potential?.maxSunshineHoursPerYear)}
            </div>
            <p className="text-xs text-muted-foreground">Location suitability</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getSolarRating(sunshineHours?: number): string {
  if (!sunshineHours) return "Good"
  if (sunshineHours >= 2000) return "Excellent"
  if (sunshineHours >= 1700) return "Very Good"
  if (sunshineHours >= 1400) return "Good"
  return "Fair"
}
