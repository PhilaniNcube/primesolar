import getSolarData from "@/utils/queries/solar-data";
import TotalPowerPotential from "./total-power-potential";
import BatteryConfig from "./battery-configuration";
import InverterConfig from "./inverter-configuration";
import SolarPanelConfig from "./solar-panel-configuration";
import ClientMap from "./client-map";

const SolarData = async ({
	latitude,
	longitude,
	address,
}: { latitude: number; longitude: number; address: string }) => {
	const solarData = await getSolarData(latitude, longitude);

  // get the solar panel rating from the solar data api;
  console.log(JSON.stringify(solarData.solarPotential.roofSegmentStats, null, 2));

	return (
    <div className="container py-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <TotalPowerPotential
          address={address}
          solarConfig={solarData.solarPotential.solarPanelConfigs}
          panelCapacityWatts={solarData.solarPotential.panelCapacityWatts}
          maxArrayArea={solarData.solarPotential.maxArrayAreaMeters2}
          roofStats={solarData.solarPotential.wholeRoofStats}
          maxPotentialKwh={
            solarData.solarPotential.solarPanelConfigs[
              solarData.solarPotential.solarPanelConfigs.length - 1
            ]?.yearlyEnergyDcKwh ?? 0
          }
        />{" "}
        {solarData.solarPotential.roofSegmentStats.length > 0 && (
            <>
              <ClientMap
               roofSegmentStats={solarData.solarPotential.roofSegmentStats}
              />
            </>
          )}
      </div>
      <div>
        <SolarPanelConfig
          solarConfig={solarData.solarPotential.solarPanelConfigs}
          panelCapacityWatts={solarData.solarPotential.panelCapacityWatts}
        />
        <BatteryConfig
          solarConfig={solarData.solarPotential.solarPanelConfigs}
        />
        <InverterConfig
          solarConfig={solarData.solarPotential.solarPanelConfigs}
        />
      </div>
    </div>
  );
};
export default SolarData;
