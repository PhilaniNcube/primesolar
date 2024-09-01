"use server";

import type { GeocodingResponse } from "@/types";
import { redirect } from "next/navigation";

export async function searchAddressAction(prevState:unknown, formData: FormData){

  const query = formData.get("address") as string;

  if (!query) {
    redirect("/error?message=Please enter a valid address");
  }


  const encodedAddress = encodeURIComponent(query);

  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_API_KEY}`;

  const response = await fetch(geocodingUrl);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: GeocodingResponse = await response.json();

    if (!data || data.status === "ZERO_RESULTS" || data.status === "INVALID_REQUEST") {
      redirect(
        `/error?message=${encodeURIComponent(
            "We could not find a location or solar data for the specified address"
          )}`
      );

    }



    redirect(`/solar-data?lat=${data.results[0]?.geometry.location.lat.toString()}&lng=${data.results[0]?.geometry.location.lng.toString()}&address=${encodedAddress}`);

}
