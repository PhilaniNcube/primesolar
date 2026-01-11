import { Suspense } from "react";
import { AddSolarPanelDialog } from "@/components/admin/add-solar-panel-dialog";
import { SolarPanelsTableServer } from "./solar-panels-table-server";
import { SolarPanelsTableSkeleton } from "./solar-panels-table-skeleton";

export function SolarPanelsClient() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solar Panels</h1>
          <p className="text-muted-foreground">
            Manage solar panel options and pricing
          </p>
        </div>
        <AddSolarPanelDialog />
      </div>

      <Suspense fallback={<SolarPanelsTableSkeleton />}>
        <SolarPanelsTableServer />
      </Suspense>
    </div>
  );
}
