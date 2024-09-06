import getSolarData from "@/utils/queries/solar-data";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import TotalPowerPotential from "./total-power-potential";
import BatteryConfig from "./battery-configuration";
import InverterConfig from "./inverter-configuration";
import SolarPanelConfig from "./solar-panel-configuration";

const SolarData = async ({
	latitude,
	longitude,
	address,
}: { latitude: number; longitude: number; address: string }) => {
	const solarData = await getSolarData(latitude, longitude);

  // get the solar panel rating from the solar data api;
  console.log(solarData);



	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "";

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
        <GoogleMapsEmbed
          apiKey={apiKey}
          height={500}
          width="100%"
          mode="place"
          q={address}
          zoom="21"
          maptype="satellite"
          style="border-radius: 5px;"
        />
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
