"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { useConfigStore } from "@/providers/solar-config-provider";
import { batteries } from "@/stores/data";
import { SolarConfig } from "@/types";
import {  CheckCircle, Minus, Plus } from "lucide-react";

interface SolarPotentialDisplayProps {

  solarConfig: SolarConfig[];

}

const BatteryConfig = ({solarConfig}:SolarPotentialDisplayProps) => {

 const {  battery, setBattery, batteryQuantity, setBatteryQuantity } = useConfigStore(
   (store) => store,
 );

  return (
    <Card className="mt-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Battery Storage
          <span className="text-blue-700 ml-4 font-extrabold">{batteryQuantity*battery.capacity} kW</span>
        </CardTitle>
        <h3 className="text-lg font-medium text-muted-foreground">
          Total Battery Cost: {formatCurrency(battery.price * batteryQuantity)}
        </h3>
      </CardHeader>
      <CardContent className="@container">
        <h3 className="text-lg font-medium text-muted-foreground">
          Battery Quantity
        </h3>
        <div className="flex max-w-xs w-[200px] items-center justify-between my-2">
          <Button onClick={() => setBatteryQuantity(batteryQuantity - 1)} disabled={batteryQuantity <= 1}>
            <Minus className="h-6 w-6" />
          </Button>

          <div className="text-xl font-semibold">{batteryQuantity}</div>
          <Button onClick={() => setBatteryQuantity(batteryQuantity + 1)}>
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <div className="grid gap-3 @md:grid-cols-2 @lg:grid-cols-3">
          {batteries.map((item) => (
            <Card
              key={item.name}
              className={cn(
                "relative cursor-pointer py-3 hover:shadow-md",
                battery.name === item.name ? "border-blue-500" : "",
              )}
              onClick={() => setBattery(item)}
            >
              {battery.name === item.name && (
                <CheckCircle className="absolute right-2 top-2 h-6 w-6 text-blue-500" />
              )}
              <CardContent>
                <h3 className="@lg:text-md text-sm font-medium text-zinc-600">
                  {item.name}
                </h3>
                <p className="text-md font-semibold text-zinc-600">
                  {item.capacity} kWh
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatCurrency(item.price)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default BatteryConfig;
