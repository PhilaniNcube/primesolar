"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatCurrency } from "@/lib/utils";
import { useConfigStore } from "@/providers/solar-config-provider";
import type { SolarConfig } from "@/types";
import { Info, Sun } from "lucide-react";
import { type ChangeEvent, use, useEffect, useState } from "react";

interface SolarPotentialDisplayProps {
	address: string;
	solarConfig: SolarConfig[];
	maxPotentialKwh: number;
  panelCapacityWatts: number;
}

export default function TotalPowerPotential({
  address,
  solarConfig,
  maxPotentialKwh,
  panelCapacityWatts,
}: SolarPotentialDisplayProps) {
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(0);

  const {
    electricityBill,
    setElectricityBill,
    solarPanel,
    solarPanelQuantity,
    setSolarPanelQuantity,
  } = useConfigStore((store) => store);

  const selectedConfig = solarConfig[selectedConfigIndex];
  // get the ratio of the solar panel rating and the panelCapacityWatts
  const panelRatingRatio = solarPanel.watts / panelCapacityWatts;

  const averageElectricityPrice = 2.07;

  // calculate the number of KW usage per month based on the electricity bill
  const monthlyKwh = (electricityBill / averageElectricityPrice);

  const dailyKwh = monthlyKwh;

  const depthOfDischarge = 0.8;

  const usableBatteryCapacity = monthlyKwh / 31 / depthOfDischarge;

  console.log(usableBatteryCapacity);

  // calculate the number of KW usage per year based on the electricity bill
  const yearlyKwh = monthlyKwh * 12;

  const potentialKwh = selectedConfig
    ? selectedConfig.yearlyEnergyDcKwh * panelRatingRatio
    : 0;

  const maxDailyGeneration = potentialKwh / 365;

  const potentialPercentage = selectedConfig
    ? ((selectedConfig.yearlyEnergyDcKwh * panelRatingRatio) / (maxPotentialKwh * panelRatingRatio)) * 100
    : 0;

  useEffect(() => {
    setSolarPanelQuantity(selectedConfig?.panelsCount || 1);
  }, [selectedConfig, setSolarPanelQuantity]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-6 w-6 text-yellow-500" />
          Solar Power Potential
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 @container">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
          <p className="text-lg font-semibold">{address}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Average Monthly Electricity Usage
          </h3>
          <p className="text-lg font-semibold">{monthlyKwh.toFixed(2)} kWh</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Average Yearly Electricity Usage
          </h3>
          <p className="text-lg font-semibold">{yearlyKwh.toFixed(2)} kWh</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Daily Electricity Usage/Minimum Battery Capacity
          </h3>
          <p className="text-lg font-semibold">
            {usableBatteryCapacity.toFixed(2)} kW
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="ml-1 h-4 w-4 text-blue-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm text-muted-foreground">
                    This is the minimum battery capacity required to store
                    enough energy to power your home for a day based on your
                    average electricity usage.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        </div>
        <div
          className={cn(
            "my-2 w-fit rounded-md border-2 p-2 shadow-lg",
            maxDailyGeneration < Number(usableBatteryCapacity.toFixed(2)) ?
              "border-red-600 bg-red-100 text-red-600" : "text-green-800 border-green-600 bg-green-50",
          )}
        >
          <h3 className="text-md font-medium">
            Maximum Daily Electricity Generation
          </h3>
          <p className="text-xl font-semibold">
            {maxDailyGeneration.toFixed(2)} kWh
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="ml-1 h-4 w-4 text-blue-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm text-muted-foreground">
                    This is the maximum amount of electricity that can be
                    generated by the current solar panel configuration in a day.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        </div>
        <div className="grid gap-3 @md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Monthly Electricity Bill
            </h3>
            <p className={cn("text-3xl font-bold")}>R{electricityBill}</p>
            <div className="mt-2 rounded-sm border-2 border-slate-400 bg-zinc-100 p-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Monthly Electricity Bill
              </h3>
              <Input
                type="number"
                value={electricityBill}
                className="mt-1 w-full"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setElectricityBill(Number(e.target.value))
                }
              />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Annual Total Solar Potential ({selectedConfig?.panelsCount}{" "}
              Panels)
            </h3>
            <p
              className={cn(
                "text-3xl font-bold",
                yearlyKwh > potentialKwh && "text-red-500",
                yearlyKwh < potentialKwh && "text-green-700",
              )}
            >
              {potentialKwh.toFixed(2)} kWh
            </p>
            <div className="mt-2 rounded-sm border-2 border-blue-400 bg-blue-100 p-3">
              <Label htmlFor="solar-config">
                Select Solar Panel Configuration
              </Label>
              <Select
                defaultValue={selectedConfigIndex.toString()}
                onValueChange={(value: string) => {
                  setSelectedConfigIndex(Number(value));
                }}
              >
                <SelectTrigger>
                  <SelectValue>
                    {selectedConfig?.panelsCount} Solar Panels
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {solarConfig.map((config: SolarConfig, index: number) => (
                    <SelectGroup key={config.panelsCount}>
                      <SelectItem value={index.toString()}>
                        <SelectLabel>{config.panelsCount} Panels</SelectLabel>
                      </SelectItem>
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0 kWh</span>
            <span className="h-2">{maxPotentialKwh.toLocaleString()} kWh</span>
          </div>
          <Progress value={potentialPercentage} className={cn("h-2")} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Solar Panel Total Cost
          </h3>
          <p className="text-lg font-semibold">
            {formatCurrency(solarPanel.price * solarPanelQuantity)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
