import { Suspense } from "react";
import SolarData from "./_components/solar-data";
import LoadingSolarComponent from "./_components/loading-component";

const SolarDataPage = async ({
	searchParams,
}: {
	searchParams?: Record<string, string | undefined>;
}) => {

  const lat = searchParams?.lat;
  const lng = searchParams?.lng;
  const address = searchParams?.address ?? "";



	// convert lat and lng to numbers
	const latitude = Number(lat);
	const longitude = Number(lng);


	return (
		<div>
			<Suspense fallback={<LoadingSolarComponent />}>
				<SolarData
					latitude={latitude}
					longitude={longitude}
					address={address}
				/>
			</Suspense>
		</div>
	);
};
export default SolarDataPage;
