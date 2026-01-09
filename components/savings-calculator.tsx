"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, Zap, Calendar, Banknote } from "lucide-react"

interface SavingsCalculatorProps {
  yearlyEnergyKwh: number
  systemCost: number
}

// South African electricity rates (2024/2025 average)
const ESKOM_RATE_PER_KWH = 2.85 // Average rate in ZAR
const ANNUAL_RATE_INCREASE = 0.12 // 12% annual increase (Eskom trend)

export function SavingsCalculator({ yearlyEnergyKwh, systemCost }: SavingsCalculatorProps) {
  const [monthlyUsageKwh, setMonthlyUsageKwh] = useState(800)
  const [currentMonthlyBill, setCurrentMonthlyBill] = useState(2500)

  const yearlyUsageKwh = monthlyUsageKwh * 12
  const currentYearlySpend = currentMonthlyBill * 12

  // Calculate what percentage of usage the solar system covers
  const coveragePercentage = Math.min((yearlyEnergyKwh / yearlyUsageKwh) * 100, 100)

  // Calculate yearly savings
  const yearlySavings = useMemo(() => {
    const energyCovered = Math.min(yearlyEnergyKwh, yearlyUsageKwh)
    return energyCovered * ESKOM_RATE_PER_KWH
  }, [yearlyEnergyKwh, yearlyUsageKwh])

  // Calculate payback period (accounting for electricity price increases)
  const paybackYears = useMemo(() => {
    let remainingCost = systemCost
    let year = 0
    let currentAnnualSavings = yearlySavings

    while (remainingCost > 0 && year < 25) {
      remainingCost -= currentAnnualSavings
      currentAnnualSavings *= 1 + ANNUAL_RATE_INCREASE
      year++
    }

    return year
  }, [systemCost, yearlySavings])

  // Calculate 25-year savings
  const twentyFiveYearSavings = useMemo(() => {
    let totalSavings = 0
    let currentAnnualSavings = yearlySavings

    for (let year = 0; year < 25; year++) {
      totalSavings += currentAnnualSavings
      currentAnnualSavings *= 1 + ANNUAL_RATE_INCREASE
    }

    return totalSavings
  }, [yearlySavings])

  const roi = ((twentyFiveYearSavings - systemCost) / systemCost) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-green-500" />
          Savings Calculator
        </CardTitle>
        <CardDescription>Enter your current electricity usage to see potential savings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="monthly-usage">Monthly Electricity Usage (kWh)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[monthlyUsageKwh]}
                onValueChange={(value) => setMonthlyUsageKwh(Array.isArray(value) ? value[0] : value)}
                min={200}
                max={2000}
                step={50}
                className="flex-1"
              />
              <Input
                id="monthly-usage"
                type="number"
                value={monthlyUsageKwh}
                onChange={(e) => setMonthlyUsageKwh(Number(e.target.value))}
                className="w-24"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="monthly-bill">Current Monthly Bill (R)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[currentMonthlyBill]}
                onValueChange={(value) => setCurrentMonthlyBill(Array.isArray(value) ? value[0] : value)}
                min={500}
                max={10000}
                step={100}
                className="flex-1"
              />
              <Input
                id="monthly-bill"
                type="number"
                value={currentMonthlyBill}
                onChange={(e) => setCurrentMonthlyBill(Number(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Coverage Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Solar Coverage of Your Usage</span>
            <Badge variant={coveragePercentage >= 100 ? "default" : "secondary"}>
              {coveragePercentage.toFixed(0)}%
            </Badge>
          </div>
          <div className="h-3 w-full rounded-full bg-secondary">
            <div
              className="h-3 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(coveragePercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {coveragePercentage >= 100
              ? "Your system produces more than you use! Consider selling back to the grid."
              : `You'll still need ${(100 - coveragePercentage).toFixed(0)}% from the grid.`}
          </p>
        </div>

        {/* Savings Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-green-500/10 p-4">
            <div className="flex items-center gap-2 text-green-500">
              <Banknote className="h-4 w-4" />
              <span className="text-sm font-medium">Yearly Savings</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">
              R{yearlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="rounded-lg bg-blue-500/10 p-4">
            <div className="flex items-center gap-2 text-blue-500">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Payback Period</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{paybackYears} years</div>
          </div>

          <div className="rounded-lg bg-primary/10 p-4">
            <div className="flex items-center gap-2 text-primary">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">25-Year Savings</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">
              R{(twentyFiveYearSavings / 1000000).toFixed(2)}M
            </div>
          </div>

          <div className="rounded-lg bg-purple-500/10 p-4">
            <div className="flex items-center gap-2 text-purple-500">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">ROI</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{roi.toFixed(0)}%</div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          *Calculations assume {(ANNUAL_RATE_INCREASE * 100).toFixed(0)}% annual electricity price increase based on
          historical Eskom trends. Actual savings may vary.
        </p>
      </CardContent>
    </Card>
  )
}
