"use client"

import { useEffect, useState, Suspense } from "react"
import { useQueryStates, parseAsString } from "nuqs"
import { MapPin, Loader2 } from "lucide-react"

interface Coordinates {
  lat: number
  lng: number
}

function EstimateContent() {
  const [params] = useQueryStates({
    place_id: parseAsString,
    address: parseAsString,
  })

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!params.place_id && !params.address) {
        setError("No address information provided")
        return
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
      if (!apiKey) {
        setError("Google Maps API key is not configured")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Wait for Google Maps API to load
        if (!window.google) {
          await new Promise<void>((resolve) => {
            const script = document.createElement("script")
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
            script.async = true
            script.defer = true
            script.onload = () => resolve()
            document.head.appendChild(script)
          })
        }

        // Use Geocoder to get coordinates from place_id or address
        const geocoder = new window.google.maps.Geocoder()
        
        const request: google.maps.GeocoderRequest = params.place_id
          ? { placeId: params.place_id }
          : { address: params.address || "" }

        geocoder.geocode(request, (results, status) => {
          setIsLoading(false)
          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location
            setCoordinates({
              lat: location.lat(),
              lng: location.lng(),
            })
          } else {
            setError(`Geocoding failed: ${status}`)
          }
        })
      } catch (err) {
        setIsLoading(false)
        setError(err instanceof Error ? err.message : "Failed to fetch coordinates")
      }
    }

    fetchCoordinates()
  }, [params.place_id, params.address])

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Solar Installation Estimate</h1>

      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Location Details
        </h2>

        {params.address && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Address:</p>
            <p className="text-lg">{params.address}</p>
          </div>
        )}

        {params.place_id && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Place ID:</p>
            <p className="text-sm font-mono bg-secondary px-2 py-1 rounded inline-block">
              {params.place_id}
            </p>
          </div>
        )}

        <div className="border-t border-border pt-4 mt-4">
          <p className="text-sm text-muted-foreground mb-2">Coordinates:</p>
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching coordinates...</span>
            </div>
          )}
          {error && (
            <div className="text-destructive">
              <p>Error: {error}</p>
            </div>
          )}
          {coordinates && !isLoading && (
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-semibold">Latitude:</span> {coordinates.lat}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Longitude:</span> {coordinates.lng}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-secondary/50 border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
        <p className="text-muted-foreground">
          We&apos;re calculating your solar installation estimate based on your location.
          This will include roof analysis, optimal panel placement, and estimated energy savings.
        </p>
      </div>
    </div>
  )
}

export default function EstimatePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    }>
      <EstimateContent />
    </Suspense>
  )
}

// Add TypeScript declarations for Google Maps
declare global {
  interface Window {
    google: typeof google
  }
}
