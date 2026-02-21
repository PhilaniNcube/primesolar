import { type NextRequest, NextResponse } from "next/server"
import type { BuildingInsightsResponse } from "@/lib/types/solar"

// Google Solar API endpoint
const SOLAR_API_URL = "https://solar.googleapis.com/v1/buildingInsights:findClosest"
const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const placeId = searchParams.get("place_id")

  if (!placeId) {
    return NextResponse.json({ error: "Missing place_id parameter" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    console.error("GOOGLE_API_KEY is not configured")
    return NextResponse.json(
      { error: "Solar service is not configured", code: "SERVICE_UNAVAILABLE" },
      { status: 503 },
    )
  }

  try {
    // First, get coordinates from place_id using Geocoding API
    const geocodeResponse = await fetch(`${GEOCODING_API_URL}?place_id=${placeId}&key=${apiKey}`)

    if (!geocodeResponse.ok) {
      throw new Error("Failed to geocode place_id")
    }

    const geocodeData = await geocodeResponse.json()

    if (geocodeData.status !== "OK" || !geocodeData.results?.[0]) {
      return NextResponse.json(
        { error: "Address could not be found", code: "ADDRESS_NOT_FOUND" },
        { status: 404 },
      )
    }

    const { lat, lng } = geocodeData.results[0].geometry.location

    // Now fetch solar data using the coordinates
    const solarResponse = await fetch(
      `${SOLAR_API_URL}?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${apiKey}`,
    )

    if (!solarResponse.ok) {
      console.warn(`HIGH quality solar data not available (${solarResponse.status}), trying MEDIUM...`)
      // Try with lower quality before giving up
      const fallbackResponse = await fetch(
        `${SOLAR_API_URL}?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=MEDIUM&key=${apiKey}`,
      )

      if (!fallbackResponse.ok) {
        console.warn(`MEDIUM quality solar data not available (${fallbackResponse.status})`)
        return NextResponse.json(
          {
            error: "No solar data is available for this address",
            code: "NO_SOLAR_DATA",
          },
          { status: 404 },
        )
      }

      const fallbackData = await fallbackResponse.json() as BuildingInsightsResponse
      return NextResponse.json(fallbackData)
    }

    const solarData = await solarResponse.json() as BuildingInsightsResponse
    return NextResponse.json(solarData)
  } catch (error) {
    console.error("Solar API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch solar data for this address", code: "FETCH_ERROR" },
      { status: 500 },
    )
  }
}

