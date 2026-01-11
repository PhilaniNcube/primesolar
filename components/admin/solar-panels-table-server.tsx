import { getSolarPanels } from "@/dal/queries/solar-panels";
import { SolarPanelsTable } from "./solar-panels-table";


export async function SolarPanelsTableServer() {
  const panels = await getSolarPanels();
  
  return <SolarPanelsTable panels={panels} />;
}
