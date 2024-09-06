"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { useConfigStore } from "@/providers/solar-config-provider";
import {  solarPanels } from "@/stores/data";
import { SolarConfig } from "@/types";
import {  CheckCircle } from "lucide-react";

interface SolarPotentialDisplayProps {
  solarConfig: SolarConfig[];
  panelCapacityWatts: number;
}

const SolarPanelConfig = ({ solarConfig, panelCapacityWatts }: SolarPotentialDisplayProps) => {
  const { solarPanel, setSolarPanel, solarPanelQuantity } = useConfigStore((store) => store);

  return (
    <Card className="mt-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Solar Panel Brand & Rating</CardTitle>
        <h3 className="text-lg font-medium text-muted-foreground">
          Total Panel Cost:{" "}
          {formatCurrency(solarPanel.price * solarPanelQuantity)}
        </h3>
      </CardHeader>
      <CardContent className="@container">
        <div className="grid gap-3 @md:grid-cols-2 @lg:grid-cols-3">
          {solarPanels.map((item) => (
            <Card
              key={item.name}
              className={cn(
                "relative cursor-pointer py-3 hover:shadow-md",
                solarPanel.name === item.name ? "border-blue-500" : "",
              )}
              onClick={() => setSolarPanel(item)}
            >
              {solarPanel.name === item.name && (
                <CheckCircle className="absolute right-2 top-2 h-6 w-6 text-blue-500" />
              )}
              <CardContent>
                <h3 className="@lg:text-md text-sm font-medium text-zinc-600">
                  {item.name}
                </h3>
                <p className="text-md font-semibold text-zinc-600">
                  {item.watts} Watts
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
export default SolarPanelConfig;
