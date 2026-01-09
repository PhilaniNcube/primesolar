"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Battery, Zap, Leaf, AlertCircle } from "lucide-react"
import { SolarDataDisplay } from "./solar-data-display"
import { CostBreakdown } from "./cost-breakdown"
import { SavingsCalculator } from "./savings-calculator"
import { formatCurrency } from "@/lib/currency"

interface SolarConfiguratorProps {
  placeId: string
  address: string
}

interface SolarData {
  center: { latitude: number; longitude: number }
  solarPotential: {
    maxArrayPanelsCount: number
    panelCapacityWatts: number
    panelHeightMeters: number
    panelWidthMeters: number
    panelLifetimeYears: number
    maxArrayAreaMeters2: number
    maxSunshineHoursPerYear: number
    carbonOffsetFactorKgPerMwh: number
    wholeRoofStats: {
      areaMeters2: number
      sunshineQuantiles: number[]
      groundAreaMeters2: number
    }
    solarPanelConfigs: Array<{
      panelsCount: number
      yearlyEnergyDcKwh: number
    }>
  }
  imageryQuality: string
}

// Panel options with South African pricing (in ZAR)
const PANEL_OPTIONS = [
  { wattage: 400, pricePerPanel: 2800, name: "Standard 400W" },
  { wattage: 450, pricePerPanel: 3200, name: "High-Efficiency 450W" },
  { wattage: 550, pricePerPanel: 4200, name: "Premium 550W" },
]

// Battery options with South African pricing (in ZAR)
const BATTERY_OPTIONS = [
  { capacityKwh: 5.12, price: 45000, name: "5.12 kWh Lithium" },
  { capacityKwh: 10.24, price: 85000, name: "10.24 kWh Lithium" },
  { capacityKwh: 15.36, price: 120000, name: "15.36 kWh Lithium" },
]

// BMS options
const BMS_OPTIONS = [
  { name: "Basic BMS", price: 8500, description: "Essential monitoring & protection" },
  { name: "Smart BMS", price: 15000, description: "WiFi enabled with app control" },
  { name: "Premium BMS", price: 25000, description: "Full home energy management" },
]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SolarConfigurator({ placeId, address }: SolarConfiguratorProps) {
  // Configuration state
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(1)
  const [panelCount, setPanelCount] = useState(10)
  const [selectedBatteryIndex, setSelectedBatteryIndex] = useState(1)
  const [batteryCount, setBatteryCount] = useState(1)
  const [selectedBmsIndex, setSelectedBmsIndex] = useState(1)
  const [includeBms, setIncludeBms] = useState(true)

  // Fetch solar data from Google Solar API
  const {
    data: solarData,
    error,
    isLoading,
  } = useSWR<SolarData>(placeId ? `/api/solar?place_id=${placeId}` : null, fetcher)

  // Update panel count based on solar data
  useEffect(() => {
    if (solarData?.solarPotential?.maxArrayPanelsCount) {
      const recommended = Math.min(Math.ceil(solarData.solarPotential.maxArrayPanelsCount * 0.5), 20)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPanelCount(recommended)
    }
  }, [solarData])

  const selectedPanel = PANEL_OPTIONS[selectedPanelIndex]
  const selectedBattery = BATTERY_OPTIONS[selectedBatteryIndex]
  const selectedBms = BMS_OPTIONS[selectedBmsIndex]

  // Calculate system specs
  const systemSizeKw = (panelCount * selectedPanel.wattage) / 1000
  const totalBatteryCapacity = batteryCount * selectedBattery.capacityKwh

  // Calculate yearly energy production (using solar data if available)
  const sunshineHours = solarData?.solarPotential?.maxSunshineHoursPerYear || 2000
  const yearlyEnergyKwh = systemSizeKw * sunshineHours * 0.8 // 80% efficiency factor

  // Calculate costs
  const panelCost = panelCount * selectedPanel.pricePerPanel
  const batteryCost = batteryCount * selectedBattery.price
  const bmsCost = includeBms ? selectedBms.price : 0
  const installationCost = (panelCost + batteryCost) * 0.15 // 15% installation
  const totalCost = panelCost + batteryCost + bmsCost + installationCost

  // Carbon offset calculation
  const carbonOffsetFactor = solarData?.solarPotential?.carbonOffsetFactorKgPerMwh || 900
  const yearlyCarbonOffsetKg = (yearlyEnergyKwh / 1000) * carbonOffsetFactor

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

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main Configuration Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Solar Data Display */}
        <SolarDataDisplay solarData={solarData} isLoading={isLoading} error={error} address={address} />

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
                <TabsTrigger value="bms">BMS</TabsTrigger>
              </TabsList>

              {/* Panels Tab */}
              <TabsContent value="panels" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <Label className="text-base">Panel Type</Label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {PANEL_OPTIONS.map((panel, index) => (
                      <button
                        key={panel.name}
                        onClick={() => setSelectedPanelIndex(index)}
                        className={`rounded-lg border-2 p-4 text-left transition-all ${
                          selectedPanelIndex === index
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium text-foreground">{panel.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(panel.pricePerPanel)} per panel
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
                    max={solarData?.solarPotential?.maxArrayPanelsCount || 50}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>4 panels</span>
                    <span>{solarData?.solarPotential?.maxArrayPanelsCount || 50} panels (max for roof)</span>
                  </div>
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
                  <Label className="text-base">Battery Type</Label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {BATTERY_OPTIONS.map((battery, index) => (
                      <button
                        key={battery.name}
                        onClick={() => setSelectedBatteryIndex(index)}
                        className={`rounded-lg border-2 p-4 text-left transition-all ${
                          selectedBatteryIndex === index
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium text-foreground">{battery.name}</div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(battery.price)}</div>
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

                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <Battery className="h-5 w-5 text-primary" />
                    <span className="font-medium">Total Storage: {totalBatteryCapacity.toFixed(2)} kWh</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Provides approximately {(totalBatteryCapacity / 1.5).toFixed(1)} hours of backup at 1.5kW average
                    load
                  </p>
                </div>
              </TabsContent>

              {/* BMS Tab */}
              <TabsContent value="bms" className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Include Battery Management System</Label>
                    <p className="text-sm text-muted-foreground">
                      Essential for monitoring and protecting your battery system
                    </p>
                  </div>
                  <Button variant={includeBms ? "default" : "outline"} onClick={() => setIncludeBms(!includeBms)}>
                    {includeBms ? "Included" : "Add BMS"}
                  </Button>
                </div>

                {includeBms && (
                  <div className="space-y-4">
                    <Label className="text-base">BMS Type</Label>
                    <div className="grid gap-3">
                      {BMS_OPTIONS.map((bms, index) => (
                        <button
                          key={bms.name}
                          onClick={() => setSelectedBmsIndex(index)}
                          className={`rounded-lg border-2 p-4 text-left transition-all ${
                            selectedBmsIndex === index
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-foreground">{bms.name}</div>
                              <div className="text-sm text-muted-foreground">{bms.description}</div>
                            </div>
                            <div className="text-lg font-semibold text-primary">{formatCurrency(bms.price)}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
          bmsCost={bmsCost}
          installationCost={installationCost}
          totalCost={totalCost}
          systemSizeKw={systemSizeKw}
          totalBatteryCapacity={totalBatteryCapacity}
          yearlyEnergyKwh={yearlyEnergyKwh}
        />

        {/* Environmental Impact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="h-5 w-5 text-green-500" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">CO₂ Offset Per Year</span>
              <span className="font-medium text-foreground">{(yearlyCarbonOffsetKg / 1000).toFixed(1)} tonnes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">25-Year Offset</span>
              <span className="font-medium text-foreground">
                {((yearlyCarbonOffsetKg * 25) / 1000).toFixed(0)} tonnes
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Trees Equivalent</span>
              <span className="font-medium text-foreground">{Math.round(yearlyCarbonOffsetKg / 21)} trees/year</span>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground">Ready to go solar?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get a detailed quote from our certified installers in your area.
            </p>
            <Button className="mt-4 w-full" size="lg">
              Request Detailed Quote
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">No obligation • Free consultation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
