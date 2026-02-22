"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Battery, Zap, Leaf, AlertCircle, MapPin, Info } from "lucide-react"
import { SolarDataDisplay } from "./solar-data-display"
import { CostBreakdown } from "./cost-breakdown"
import { SavingsCalculator } from "./savings-calculator"
import { formatCurrency } from "@/lib/currency"
import type { BuildingInsightsResponse } from "@/lib/types/solar"
import type { solarPanels, batteries, inverters } from "@/db/schema"

type DBSolarPanel = typeof solarPanels.$inferSelect
type DBBattery = typeof batteries.$inferSelect
type DBInverter = typeof inverters.$inferSelect

interface SolarConfiguratorProps {
  placeId: string
  address: string
  dbPanels: DBSolarPanel[]
  dbBatteries: DBBattery[]
  dbInverters: DBInverter[]
}

/**
 * Given a target API-equivalent panel count and the solarPanelConfigs array,
 * returns the closest config entry's yearly energy (DC kWh).
 */
function lookupApiEnergy(
  configs: BuildingInsightsResponse["solarPotential"]["solarPanelConfigs"],
  targetCount: number,
): number | null {
  if (!configs || configs.length === 0) return null
  const clamped = Math.max(1, Math.min(targetCount, configs[configs.length - 1].panelsCount))
  let best = configs[0]
  for (const cfg of configs) {
    if (Math.abs(cfg.panelsCount - clamped) < Math.abs(best.panelsCount - clamped)) {
      best = cfg
    }
  }
  return best.yearlyEnergyDcKwh
}

const fetcher = async (url: string): Promise<BuildingInsightsResponse> => {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || "Failed to fetch solar data")
  }
  return res.json()
}

export function SolarConfigurator({
  placeId,
  address,
  dbPanels,
  dbBatteries,
  dbInverters,
}: SolarConfiguratorProps) {
  const router = useRouter()

  // Configuration state
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(0)
  const [panelCount, setPanelCount] = useState(10)
  const [selectedBatteryIndex, setSelectedBatteryIndex] = useState(0)
  const [batteryCount, setBatteryCount] = useState(1)
  const [selectedInverterIndex, setSelectedInverterIndex] = useState(0)

  // Fetch solar data from Google Solar API
  const {
    data: solarData,
    error,
    isLoading,
  } = useSWR<BuildingInsightsResponse>(placeId ? `/api/solar?place_id=${placeId}` : null, fetcher)

  // -------------------------------------------------------------------------
  // Selected items from DB
  // -------------------------------------------------------------------------
  const selectedPanel = dbPanels[selectedPanelIndex] ?? null
  const selectedBattery = dbBatteries[selectedBatteryIndex] ?? null
  const selectedInverter = dbInverters[selectedInverterIndex] ?? null

  // -------------------------------------------------------------------------
  // Google Solar API assumed panel specs
  // -------------------------------------------------------------------------
  const apiPanelCapacityW = solarData?.solarPotential?.panelCapacityWatts ?? 250
  const apiPanelHeightM = solarData?.solarPotential?.panelHeightMeters ?? 1.65
  const apiPanelWidthM = solarData?.solarPotential?.panelWidthMeters ?? 0.99
  const apiPanelAreaM2 = apiPanelHeightM * apiPanelWidthM
  const apiMaxPanels = solarData?.solarPotential?.maxArrayPanelsCount ?? 50

  // -------------------------------------------------------------------------
  // Actual panel specs from DB
  // -------------------------------------------------------------------------
  const actualPanelLengthM = selectedPanel ? selectedPanel.dimensionsLengthMm / 1000 : apiPanelHeightM
  const actualPanelWidthM_dim = selectedPanel ? selectedPanel.dimensionsWidthMm / 1000 : apiPanelWidthM
  const actualPanelAreaM2 = actualPanelLengthM * actualPanelWidthM_dim
  const actualPanelCapacityW = selectedPanel?.wattage ?? apiPanelCapacityW

  // -------------------------------------------------------------------------
  // Dimension-adjusted max panels
  // Scale the API's count by the inverse of the area ratio:
  //   larger panels → fewer fit; smaller panels → more fit.
  // -------------------------------------------------------------------------
  const adjustedMaxPanels = useMemo(() => {
    if (!solarData) return apiMaxPanels
    return Math.max(4, Math.floor(apiMaxPanels * (apiPanelAreaM2 / actualPanelAreaM2)))
  }, [solarData, apiMaxPanels, apiPanelAreaM2, actualPanelAreaM2])

  // Adjust panel count when adjustedMaxPanels changes (render-time adjustment
  // instead of an effect to avoid cascading renders – see React docs
  // "Adjusting some state when a prop changes").
  const [prevAdjustedMax, setPrevAdjustedMax] = useState<number | null>(null)
  if (adjustedMaxPanels !== prevAdjustedMax) {
    setPrevAdjustedMax(adjustedMaxPanels)
    const recommended = Math.min(Math.ceil(adjustedMaxPanels * 0.5), 20)
    setPanelCount(Math.max(4, recommended))
  }

  // -------------------------------------------------------------------------
  // Wattage-corrected yearly energy production
  //
  // 1. Map our N panels back to an API-equivalent count (same roof area used).
  // 2. Look up the irradiance-based energy from the API's solarPanelConfigs.
  // 3. Scale by (actual wattage / API assumed wattage).
  // -------------------------------------------------------------------------
  const yearlyEnergyKwh = useMemo(() => {
    const wattageRatio = actualPanelCapacityW / apiPanelCapacityW

    const configs = solarData?.solarPotential?.solarPanelConfigs
    if (configs && configs.length > 0) {
      const apiEquivCount = Math.round(panelCount * (actualPanelAreaM2 / apiPanelAreaM2))
      const apiEnergy = lookupApiEnergy(configs, apiEquivCount)
      if (apiEnergy !== null) {
        return apiEnergy * wattageRatio
      }
    }

    // Fallback: simple irradiance formula
    const systemSizeKw = (panelCount * actualPanelCapacityW) / 1000
    const sunshineHours = solarData?.solarPotential?.maxSunshineHoursPerYear ?? 2000
    return systemSizeKw * sunshineHours * 0.8
  }, [panelCount, actualPanelCapacityW, apiPanelCapacityW, actualPanelAreaM2, apiPanelAreaM2, solarData])

  // -------------------------------------------------------------------------
  // System specs & costs  (pricePerUnit stored in cents → ÷ 100 for ZAR)
  // -------------------------------------------------------------------------
  const systemSizeKw = (panelCount * actualPanelCapacityW) / 1000
  const totalBatteryCapacity = selectedBattery ? batteryCount * selectedBattery.capacityKwh : 0

  const panelCost = selectedPanel ? panelCount * selectedPanel.pricePerUnit : 0
  const batteryCost = selectedBattery ? batteryCount * selectedBattery.pricePerUnit : 0
  const inverterCost = selectedInverter ? selectedInverter.pricePerUnit : 0
  const installationCost = (panelCost + batteryCost) * 0.15
  const totalCost = panelCost + batteryCost + inverterCost + installationCost

  const carbonOffsetFactor = solarData?.solarPotential?.carbonOffsetFactorKgPerMwh ?? 900
  const yearlyCarbonOffsetKg = (yearlyEnergyKwh / 1000) * carbonOffsetFactor

  // Show info notice when our panel specs differ meaningfully from the API assumption
  const capacityDiffPercent = Math.abs(actualPanelCapacityW - apiPanelCapacityW) / apiPanelCapacityW
  const dimensionsDiffer = Math.abs(actualPanelAreaM2 - apiPanelAreaM2) / apiPanelAreaM2 > 0.05
  const showCorrectionNotice = !!solarData && (capacityDiffPercent > 0.05 || dimensionsDiffer)

  // -------------------------------------------------------------------------
  // Guards
  // -------------------------------------------------------------------------
  if (!placeId) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-4 py-8">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-semibold text-foreground">Missing Location Data</h3>
            <p className="text-muted-foreground">
              Please go back to the home page and enter your address to get a solar estimate.
            </p>
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
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>No Solar Data Available</CardTitle>
          </div>
          <CardDescription className="flex items-center gap-1 pt-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {address}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We don&apos;t have solar data for this address. This usually means Google Solar API does not yet have
            imagery coverage for this location.
          </p>
          <p className="text-sm text-muted-foreground">
            Try a nearby address, or contact us and our team will manually assess the solar potential for your
            property.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="default" onClick={() => router.push("/")}>
              Try Another Address
            </Button>
            <Button variant="outline" onClick={() => router.push("/#contact")}>
              Contact Us
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (dbPanels.length === 0 || dbBatteries.length === 0 || dbInverters.length === 0) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex items-center gap-4 py-8">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-semibold text-foreground">Products Unavailable</h3>
            <p className="text-muted-foreground">
              Our product catalogue is currently unavailable. Please contact us for a quote.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main Configuration Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Solar Data Display */}
        <SolarDataDisplay solarData={solarData} isLoading={isLoading} error={error} address={address} />

        {/* Correction notice */}
        {showCorrectionNotice && (
          <div className="flex items-start gap-3 rounded-lg border border-blue-500/40 bg-blue-500/10 p-4 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">Estimates adjusted for your selected panel</p>
              <p className="text-muted-foreground">
                The Google Solar API assumed{" "}
                <span className="text-foreground">{apiPanelCapacityW}W</span> panels measuring{" "}
                <span className="text-foreground">
                  {(apiPanelHeightM * 1000).toFixed(0)}mm × {(apiPanelWidthM * 1000).toFixed(0)}mm
                </span>
                . Your selected{" "}
                <span className="text-foreground">
                  {selectedPanel?.brand} {selectedPanel?.model}
                </span>{" "}
                is{" "}
                <span className="text-foreground">{actualPanelCapacityW}W</span> at{" "}
                <span className="text-foreground">
                  {selectedPanel?.dimensionsLengthMm}mm × {selectedPanel?.dimensionsWidthMm}mm
                </span>
                . The maximum panel count and energy production have been recalculated accordingly.
              </p>
            </div>
          </div>
        )}

        {/* Configuration Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Configure Your System
            </CardTitle>
            <CardDescription>Customize your solar installation based on your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="panels" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="panels">Solar Panels</TabsTrigger>
                <TabsTrigger value="batteries">Batteries</TabsTrigger>
                <TabsTrigger value="inverter">Inverter</TabsTrigger>
              </TabsList>

              {/* Panels Tab */}
              <TabsContent value="panels" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <Label className="text-base">Panel Model</Label>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {dbPanels.map((panel, index) => (
                      <button
                        key={panel.id}
                        onClick={() => setSelectedPanelIndex(index)}
                        className={`rounded-lg border-2 p-4 text-left transition-all ${
                          selectedPanelIndex === index
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium text-foreground">
                          {panel.brand} {panel.model}
                        </div>
                        <div className="mt-1 text-sm text-primary font-semibold">{panel.wattage}W</div>
                        <div className="text-xs text-muted-foreground">{panel.efficiency}% efficiency</div>
                        <div className="text-xs text-muted-foreground">
                          {panel.dimensionsLengthMm}mm × {panel.dimensionsWidthMm}mm
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {formatCurrency(panel.pricePerUnit)} / panel
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Number of Panels</Label>
                    <Badge variant="secondary" className="text-base">
                      {panelCount} panels
                    </Badge>
                  </div>
                  <Slider
                    value={[panelCount]}
                    onValueChange={(value) => setPanelCount(Array.isArray(value) ? value[0] : value)}
                    min={4}
                    max={adjustedMaxPanels}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>4 panels</span>
                    <span>{adjustedMaxPanels} panels (max for roof)</span>
                  </div>
                  {solarData && adjustedMaxPanels !== apiMaxPanels && (
                    <p className="text-xs text-muted-foreground">
                      API originally calculated a max of {apiMaxPanels} panels for{" "}
                      {(apiPanelHeightM * 1000).toFixed(0)}mm × {(apiPanelWidthM * 1000).toFixed(0)}mm panels.
                      Adjusted to {adjustedMaxPanels} for your{" "}
                      {selectedPanel?.dimensionsLengthMm}mm × {selectedPanel?.dimensionsWidthMm}mm panels.
                    </p>
                  )}
                </div>

                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <Sun className="h-5 w-5 text-primary" />
                    <span className="font-medium">System Size: {systemSizeKw.toFixed(2)} kW</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Estimated annual production:{" "}
                    {yearlyEnergyKwh.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh
                  </p>
                </div>
              </TabsContent>

              {/* Batteries Tab */}
              <TabsContent value="batteries" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <Label className="text-base">Battery Model</Label>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {dbBatteries.map((battery, index) => (
                      <button
                        key={battery.id}
                        onClick={() => setSelectedBatteryIndex(index)}
                        className={`rounded-lg border-2 p-4 text-left transition-all ${
                          selectedBatteryIndex === index
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium text-foreground">
                          {battery.brand} {battery.model}
                        </div>
                        <div className="mt-1 text-sm text-primary font-semibold">
                          {battery.capacityKwh} kWh
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Max {battery.maxContinuousPowerKw} kW continuous
                        </div>
                        <div className="text-xs text-muted-foreground">{battery.weightKg} kg</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {formatCurrency(battery.pricePerUnit)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Number of Batteries</Label>
                    <Badge variant="secondary" className="text-base">
                      {batteryCount} {batteryCount === 1 ? "battery" : "batteries"}
                    </Badge>
                  </div>
                  <Slider
                    value={[batteryCount]}
                    onValueChange={(value) => setBatteryCount(Array.isArray(value) ? value[0] : value)}
                    min={1}
                    max={6}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 battery</span>
                    <span>6 batteries</span>
                  </div>
                </div>

                <div className="p-4 bg-primary/10">
                  <div className="flex items-center gap-2">
                    <Battery className="h-5 w-5" />
                    <span className="font-medium">Total Storage: {totalBatteryCapacity.toFixed(2)} kWh</span>
                  </div>
                  {selectedBattery && (
                    <p className="mt-1 text-sm ">
                      Provides approximately{" "}
                      {(totalBatteryCapacity / selectedBattery.maxContinuousPowerKw).toFixed(1)} hours of backup
                      at {selectedBattery.maxContinuousPowerKw} kW continuous load
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Inverter Tab */}
              <TabsContent value="inverter" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <Label className="text-base">Inverter Model</Label>
                  <div className="grid gap-3">
                    {dbInverters.map((inverter, index) => (
                      <button
                        key={inverter.id}
                        onClick={() => setSelectedInverterIndex(index)}
                        className={`rounded-lg border-2 p-4 text-left transition-all ${
                          selectedInverterIndex === index
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-medium text-foreground">
                              {inverter.brand} {inverter.model}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {inverter.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Max input: {inverter.maxInputVoltage}V
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Efficiency: {inverter.efficiency}%
                              </span>
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-primary">
                            {formatCurrency(inverter.pricePerUnit)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Savings Calculator */}
        <SavingsCalculator yearlyEnergyKwh={yearlyEnergyKwh} systemCost={totalCost} />
      </div>

      {/* Cost Summary Sidebar */}
      <div className="space-y-6">
        <CostBreakdown
          panelCost={panelCost}
          batteryCost={batteryCost}
          bmsCost={inverterCost}
          installationCost={installationCost}
          totalCost={totalCost}
          systemSizeKw={systemSizeKw}
          totalBatteryCapacity={totalBatteryCapacity}
          yearlyEnergyKwh={yearlyEnergyKwh}
          configData={{
            address,
            latitude: solarData?.center?.latitude ?? 0,
            longitude: solarData?.center?.longitude ?? 0,
            googleSolarData: solarData ?? undefined,
            panelId: selectedPanel?.id ?? "",
            panelQuantity: panelCount,
            batteryId: selectedBattery?.id ?? "",
            batteryQuantity: batteryCount,
            inverterId: selectedInverter?.id ?? "",
          }}
        />

        {/* Environmental Impact */}
       

        {/* CTA */}
  
      </div>
    </div>
  )
}
