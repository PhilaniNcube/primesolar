// Focused script to log structural data for type generation
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")

function loadEnvLocal() {
  try {
    const lines = readFileSync(resolve(ROOT, ".env.local"), "utf-8").split("\n")
    for (const line of lines) {
      const t = line.trim()
      if (!t || t.startsWith("#")) continue
      const i = t.indexOf("=")
      if (i === -1) continue
      const key = t.slice(0, i).trim()
      const value = t.slice(i + 1).trim().replace(/^["']|["']$/g, "")
      if (!(key in process.env)) process.env[key] = value
    }
  } catch {}
}
loadEnvLocal()

const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json"
const SOLAR_API_URL = "https://solar.googleapis.com/v1/buildingInsights:findClosest"
const ADDRESS = "9 Athlone Street, Mount Pleasant, Port Elizabeth, South Africa"
const apiKey = process.env.GOOGLE_API_KEY

if (!apiKey) {
  console.error("GOOGLE_API_KEY not found. Add it to .env.local")
  process.exit(1)
}

const geoRes = await fetch(`${GEOCODING_API_URL}?address=${encodeURIComponent(ADDRESS)}&key=${apiKey}`)
const geoData = await geoRes.json()
const { lat, lng } = geoData.results[0].geometry.location

const solarRes = await fetch(`${SOLAR_API_URL}?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${apiKey}`)
const d = await solarRes.json()

console.log("=== TOP LEVEL FIELDS ===")
console.log(JSON.stringify({
  name: d.name,
  center: d.center,
  imageryDate: d.imageryDate,
  postalCode: d.postalCode,
  administrativeArea: d.administrativeArea,
  regionCode: d.regionCode,
  boundingBox: d.boundingBox,
  imageryQuality: d.imageryQuality,
  imageryProcessedDate: d.imageryProcessedDate,
}, null, 2))

console.log("\n=== solarPotential scalars ===")
const sp = d.solarPotential
console.log(JSON.stringify({
  maxArrayPanelsCount: sp.maxArrayPanelsCount,
  maxArrayAreaMeters2: sp.maxArrayAreaMeters2,
  maxSunshineHoursPerYear: sp.maxSunshineHoursPerYear,
  carbonOffsetFactorKgPerMwh: sp.carbonOffsetFactorKgPerMwh,
  panelCapacityWatts: sp.panelCapacityWatts,
  panelHeightMeters: sp.panelHeightMeters,
  panelWidthMeters: sp.panelWidthMeters,
  panelLifetimeYears: sp.panelLifetimeYears,
}, null, 2))

console.log("\n=== wholeRoofStats ===")
console.log(JSON.stringify(sp.wholeRoofStats, null, 2))

console.log("\n=== buildingStats ===")
console.log(JSON.stringify(sp.buildingStats, null, 2))

console.log("\n=== roofSegmentStats[0] ===")
console.log(JSON.stringify(sp.roofSegmentStats[0], null, 2))

console.log("\n=== solarPanelConfigs[0] ===")
console.log(JSON.stringify(sp.solarPanelConfigs[0], null, 2))

console.log("\n=== solarPanels[0] ===")
console.log(JSON.stringify(sp.solarPanels[0], null, 2))
