/**
 * TypeScript types for the Google Solar API (buildingInsights:findClosest)
 * Generated from a real API response for 9 Athlone Street, Mount Pleasant, Port Elizabeth
 * https://solar.googleapis.com/v1/buildingInsights:findClosest
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export interface LatLng {
  latitude: number
  longitude: number
}

export interface SolarDate {
  year: number
  month: number
  day: number
}

export interface BoundingBox {
  sw: LatLng
  ne: LatLng
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

/**
 * Size and sunshine statistics for a roof area or whole building.
 * sunshineQuantiles is an 11-element array (0th–10th decile).
 */
export interface SolarStats {
  areaMeters2: number
  sunshineQuantiles: number[]
  groundAreaMeters2: number
}

// ---------------------------------------------------------------------------
// Roof segments
// ---------------------------------------------------------------------------

export interface RoofSegmentSizeAndSunshineStats {
  pitchDegrees: number
  azimuthDegrees: number
  stats: SolarStats
  center: LatLng
  boundingBox: BoundingBox
  planeHeightAtCenterMeters: number
}

// ---------------------------------------------------------------------------
// Solar panel configs
// ---------------------------------------------------------------------------

export interface RoofSegmentSummary {
  pitchDegrees: number
  azimuthDegrees: number
  panelsCount: number
  yearlyEnergyDcKwh: number
  segmentIndex: number
}

export interface SolarPanelConfig {
  panelsCount: number
  yearlyEnergyDcKwh: number
  roofSegmentSummaries: RoofSegmentSummary[]
}

// ---------------------------------------------------------------------------
// Individual solar panels
// ---------------------------------------------------------------------------

export type PanelOrientation = "LANDSCAPE" | "PORTRAIT"

export interface SolarPanel {
  center: LatLng
  orientation: PanelOrientation
  yearlyEnergyDcKwh: number
  segmentIndex: number
}

// ---------------------------------------------------------------------------
// Solar potential
// ---------------------------------------------------------------------------

export interface SolarPotential {
  maxArrayPanelsCount: number
  maxArrayAreaMeters2: number
  maxSunshineHoursPerYear: number
  carbonOffsetFactorKgPerMwh: number
  panelCapacityWatts: number
  panelHeightMeters: number
  panelWidthMeters: number
  panelLifetimeYears: number
  /** Stats for the entire roof surface */
  wholeRoofStats: SolarStats
  /** Stats including surrounding building walls */
  buildingStats: SolarStats
  /** Per-segment breakdown of roof areas */
  roofSegmentStats: RoofSegmentSizeAndSunshineStats[]
  /** All possible panel count configurations from min to maxArrayPanelsCount */
  solarPanelConfigs: SolarPanelConfig[]
  /** Individual panel placements for the maximum array */
  solarPanels: SolarPanel[]
}

// ---------------------------------------------------------------------------
// Top-level response
// ---------------------------------------------------------------------------

export type ImageryQuality = "HIGH" | "MEDIUM" | "LOW"

export interface BuildingInsightsResponse {
  /** Resource name, e.g. "buildings/ChIJWX3IcdrReh4Ry_sRFxGo0_E" */
  name: string
  /** Geographic center of the building */
  center: LatLng
  /** Date of the source imagery used */
  imageryDate: SolarDate
  /** Postal code of the building */
  postalCode: string
  /** Administrative area code (e.g. "EC" for Eastern Cape) */
  administrativeArea: string
  /** ISO 3166-1 alpha-2 region code (e.g. "ZA") */
  regionCode: string
  /** Bounding box of the building footprint */
  boundingBox: BoundingBox
  /** Quality of the imagery used for analysis */
  imageryQuality: ImageryQuality
  /** Date the imagery was processed */
  imageryProcessedDate: SolarDate
  /** All solar analysis data */
  solarPotential: SolarPotential
}
