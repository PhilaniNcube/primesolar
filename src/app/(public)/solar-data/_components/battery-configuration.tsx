"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { useConfigStore } from "@/providers/solar-config-provider";
import { batteries } from "@/stores/data";
import { SolarConfig } from "@/types";
import { Check, CheckCircle } from "lucide-react";

interface SolarPotentialDisplayProps {

  solarConfig: SolarConfig[];

}

const BatteryConfig = ({solarConfig}:SolarPotentialDisplayProps) => {

 const { electricityBill, setElectricityBill, battery, setBattery, batteryQuantity } = useConfigStore(
   (store) => store,
 );

  return (
    <Card className="mt-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Battery Configuration</CardTitle>
        <h3 className="text-lg font-medium text-muted-foreground">
          Total Battery Cost: {formatCurrency(battery.price * batteryQuantity)}
        </h3>
      </CardHeader>
      <CardContent className="@container">
        <div className="grid gap-3 @md:grid-cols-2 @lg:grid-cols-3">
          {batteries.map((item) => (
            <Card key={item.name} className={cn("relative py-3 cursor-pointer hover:shadow-md",
              battery.name === item.name ? "border-blue-500" : ""
            )}
            onClick={() => setBattery(item)}
            >
            {battery.name === item.name && (
              <CheckCircle className="absolute top-2 right-2 w-6 h-6 text-blue-500" />
            )}
              <CardContent>
                <h3 className="@lg:text-md text-sm font-medium text-zinc-600">
                  {item.name}
                </h3>
                <p className="text-md text-zinc-600 font-semibold">
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
