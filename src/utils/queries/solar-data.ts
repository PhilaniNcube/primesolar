/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { DataResponse } from "@/types";
import { redirect } from "next/navigation";

async function getSolarData(lat:number, lng:number) {


     const url = new URL(
     `https://solar.googleapis.com/v1/buildingInsights:findClosest?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
   );

    url.searchParams.append("location.latitude", lat.toString());
    url.searchParams.append("location.longitude", lng.toString());

    const response = await fetch(url.toString());

    const data = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if(data?.error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        redirect(`/error?message=${encodeURIComponent("We could not find a location or solar data for the specified address")}`);
      }


      return data as DataResponse

}


export default getSolarData;
