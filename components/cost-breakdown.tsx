"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/currency"
import { Zap, Battery, Cpu, Wrench } from "lucide-react"

interface CostBreakdownProps {
  panelCost: number
  batteryCost: number
  bmsCost: number
  installationCost: number
  totalCost: number
  systemSizeKw: number
  totalBatteryCapacity: number
  yearlyEnergyKwh: number
}

export function CostBreakdown({
  panelCost,
  batteryCost,
  bmsCost,
  installationCost,
  totalCost,
  systemSizeKw,
  totalBatteryCapacity,
  yearlyEnergyKwh,
}: CostBreakdownProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Summary */}
        <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">System Size</span>
            <span className="font-medium text-foreground">{systemSizeKw.toFixed(2)} kW</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Battery Storage</span>
            <span className="font-medium text-foreground">{totalBatteryCapacity.toFixed(2)} kWh</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Annual Production</span>
            <span className="font-medium text-foreground">
              {yearlyEnergyKwh.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh
            </span>
          </div>
        </div>

        <Separator />

        {/* Cost Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-foreground">Solar Panels</span>
            </div>
            <span className="font-medium text-foreground">{formatCurrency(panelCost)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-primary" />
              <span className="text-foreground">Batteries</span>
            </div>
            <span className="font-medium text-foreground">{formatCurrency(batteryCost)}</span>
          </div>

          {bmsCost > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-foreground">BMS</span>
              </div>
              <span className="font-medium text-foreground">{formatCurrency(bmsCost)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <span className="text-foreground">Installation</span>
            </div>
            <span className="font-medium text-foreground">
              {formatCurrency(installationCost)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">Total Estimate</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(totalCost)}
          </span>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          *Prices are estimates and may vary based on site assessment
        </p>
      </CardContent>
    </Card>
  )
}
