import { type NextRequest, NextResponse } from "next/server"

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
    console.warn("No Google API key configured, returning mock data")
    // Return mock data if no API key is configured
    return NextResponse.json(getMockSolarData())
  }

  try {
    // First, get coordinates from place_id using Geocoding API
    const geocodeResponse = await fetch(`${GEOCODING_API_URL}?place_id=${placeId}&key=${apiKey}`)

    if (!geocodeResponse.ok) {
      throw new Error("Failed to geocode place_id")
    }

    const geocodeData = await geocodeResponse.json()

    if (geocodeData.status !== "OK" || !geocodeData.results?.[0]) {
      throw new Error("No results found for place_id")
    }

    const { lat, lng } = geocodeData.results[0].geometry.location

    // Now fetch solar data using the coordinates
    const solarResponse = await fetch(
      `${SOLAR_API_URL}?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${apiKey}`,
    )

    if (!solarResponse.ok) {
        console.warn("High quality solar data not available, trying fallback")
      // If HIGH quality not available, try with lower quality
      const fallbackResponse = await fetch(
        `${SOLAR_API_URL}?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=MEDIUM&key=${apiKey}`,
      )

      if (!fallbackResponse.ok) {
        throw new Error("Solar API request failed")
      }

      const fallbackData = await fallbackResponse.json()
      console.log("Using fallback solar data due to quality constraints")
      return NextResponse.json(fallbackData)
    }

    const solarData = await solarResponse.json()
    return NextResponse.json(solarData)
  } catch (error) {
    console.error("Solar API error:", error)
    // Return mock data as fallback
    return NextResponse.json(getMockSolarData())
  }
}

function getMockSolarData() {
  // Mock data for South African locations
  return {
    center: {
      latitude: -33.9249,
      longitude: 18.4241,
    },
    imageryDate: {
      year: 2024,
      month: 6,
      day: 15,
    },
    imageryQuality: "HIGH",
    solarPotential: {
      maxArrayPanelsCount: 35,
      panelCapacityWatts: 400,
      panelHeightMeters: 1.65,
      panelWidthMeters: 0.99,
      panelLifetimeYears: 25,
      maxArrayAreaMeters2: 58.5,
      maxSunshineHoursPerYear: 2100, // South Africa has excellent solar irradiation
      carbonOffsetFactorKgPerMwh: 900, // SA grid is coal-heavy, so offset is higher
      wholeRoofStats: {
        areaMeters2: 180,
        sunshineQuantiles: [1200, 1400, 1600, 1800, 1900, 2000, 2050, 2100, 2150, 2200, 2300],
        groundAreaMeters2: 165,
      },
      buildingStats: {
        areaMeters2: 200,
        sunshineQuantiles: [1100, 1300, 1500, 1700, 1850, 1950, 2000, 2050, 2100, 2150, 2250],
        groundAreaMeters2: 180,
      },
      solarPanelConfigs: [
        { panelsCount: 10, yearlyEnergyDcKwh: 6800 },
        { panelsCount: 15, yearlyEnergyDcKwh: 10200 },
        { panelsCount: 20, yearlyEnergyDcKwh: 13600 },
        { panelsCount: 25, yearlyEnergyDcKwh: 17000 },
        { panelsCount: 30, yearlyEnergyDcKwh: 20400 },
        { panelsCount: 35, yearlyEnergyDcKwh: 23800 },
      ],
    },
  }
}
