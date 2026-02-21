// Script to test Google Solar API with a specific address and log the full response
// Run with: node scripts/test-solar-api.mjs
// Or:       GOOGLE_API_KEY=your_key node scripts/test-solar-api.mjs
// Or create a .env.local file with GOOGLE_API_KEY=your_key

import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")

// Try to load .env.local manually (no dotenv dependency needed)
function loadEnvLocal() {
  try {
    const envPath = resolve(ROOT, ".env.local")
    const lines = readFileSync(envPath, "utf-8").split("\n")
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "")
      if (!(key in process.env)) process.env[key] = value
    }
    console.log("Loaded .env.local")
  } catch {
    // No .env.local file — that's fine
  }
}

loadEnvLocal()

const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json"
const SOLAR_API_URL = "https://solar.googleapis.com/v1/buildingInsights:findClosest"

const ADDRESS = "9 Athlone Street, Mount Pleasant, Port Elizabeth, South Africa"

const apiKey = process.env.GOOGLE_API_KEY

if (!apiKey) {
  console.error("ERROR: GOOGLE_API_KEY environment variable is not set.")
  console.error("Options:")
  console.error("  1. Create a .env.local file in the project root with:  GOOGLE_API_KEY=your_key")
  console.error("  2. Run with: GOOGLE_API_KEY=your_key node scripts/test-solar-api.mjs")
  process.exit(1)
}

async function main() {
  console.log(`\nGeocoding address: "${ADDRESS}"`)
  console.log("=".repeat(60))

  // Step 1: Geocode the address
  const geocodeUrl = `${GEOCODING_API_URL}?address=${encodeURIComponent(ADDRESS)}&key=${apiKey}`
  const geocodeRes = await fetch(geocodeUrl)
  const geocodeData = await geocodeRes.json()

  if (geocodeData.status !== "OK" || !geocodeData.results?.[0]) {
    console.error("Geocoding failed:", geocodeData.status, geocodeData.error_message)
    process.exit(1)
  }

  const { lat, lng } = geocodeData.results[0].geometry.location
  console.log(`Coordinates: lat=${lat}, lng=${lng}`)
  console.log(`Place ID: ${geocodeData.results[0].place_id}`)

  // Step 2: Call the Solar API
  console.log("\nCalling Google Solar API (requiredQuality=HIGH)...")
  console.log("=".repeat(60))

  let solarRes = await fetch(
    `${SOLAR_API_URL}?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${apiKey}`
  )

  if (!solarRes.ok) {
    console.warn(`HIGH quality failed (${solarRes.status}), trying MEDIUM...`)
    solarRes = await fetch(
      `${SOLAR_API_URL}?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=MEDIUM&key=${apiKey}`
    )
  }

  if (!solarRes.ok) {
    console.warn(`MEDIUM quality failed (${solarRes.status}), trying LOW...`)
    solarRes = await fetch(
      `${SOLAR_API_URL}?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=LOW&key=${apiKey}`
    )
  }

  if (!solarRes.ok) {
    const errText = await solarRes.text()
    console.error("Solar API request failed:", solarRes.status, errText)
    process.exit(1)
  }

  const solarData = await solarRes.json()

  console.log("\nFULL SOLAR API RESPONSE:")
  console.log("=".repeat(60))
  console.log(JSON.stringify(solarData, null, 2))

  console.log("\n\nTOP-LEVEL KEYS:", Object.keys(solarData))

  if (solarData.solarPotential) {
    console.log("\nsolarPotential KEYS:", Object.keys(solarData.solarPotential))

    if (solarData.solarPotential.solarPanelConfigs?.length) {
      console.log("\nFirst solarPanelConfig entry:", JSON.stringify(solarData.solarPotential.solarPanelConfigs[0], null, 2))
      console.log("solarPanelConfig entry KEYS:", Object.keys(solarData.solarPotential.solarPanelConfigs[0]))
    }

    if (solarData.solarPotential.financialAnalyses?.length) {
      console.log("\nFirst financialAnalysis entry:", JSON.stringify(solarData.solarPotential.financialAnalyses[0], null, 2))
    }

    if (solarData.solarPotential.solarPanels?.length) {
      console.log("\nFirst solarPanel entry:", JSON.stringify(solarData.solarPotential.solarPanels[0], null, 2))
    }
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err)
  process.exit(1)
})
