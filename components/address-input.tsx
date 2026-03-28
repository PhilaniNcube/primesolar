"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, ArrowRight } from "lucide-react"
import { sendGTMEvent } from "@next/third-parties/google"

interface SelectedPlace {
  description: string
  place_id: string
}

interface GooglePlaceResult {
  place_id?: string
  formatted_address?: string
  name?: string
}

interface GoogleAutocompleteInstance {
  addListener: (eventName: "place_changed", handler: () => void) => { remove: () => void }
  getPlace: () => GooglePlaceResult
}

interface GoogleMapsWindow extends Window {
  google?: {
    maps?: {
      places?: {
        Autocomplete: new (
          input: HTMLInputElement,
          options: {
            componentRestrictions: { country: string }
            fields: string[]
            types: string[]
          }
        ) => GoogleAutocompleteInstance
      }
    }
  }
}

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-places-script"

function loadGoogleMapsPlacesScript(apiKey: string) {
  if (typeof window === "undefined") {
    return Promise.resolve()
  }

  if (window.google?.maps?.places?.Autocomplete) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as
      | HTMLScriptElement
      | null

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true })
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Maps script")),
        { once: true }
      )
      return
    }

    const script = document.createElement("script")
    script.id = GOOGLE_MAPS_SCRIPT_ID
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&region=za&loading=async`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Google Maps script"))

    document.head.appendChild(script)
  })
}

export function AddressInput() {
  const [inputValue, setInputValue] = useState("")
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null)
  const [isMapsReady, setIsMapsReady] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const autocompleteRef = useRef<GoogleAutocompleteInstance | null>(null)
  const router = useRouter()

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const hasApiKey = Boolean(apiKey)

  useEffect(() => {
    if (!apiKey) {
      console.error("Google Maps API key is not set")
      return
    }

    let isMounted = true

    loadGoogleMapsPlacesScript(apiKey)
      .then(() => {
        if (isMounted) {
          setIsMapsReady(true)
        }
      })
      .catch((error) => {
        console.error("Failed to initialize Google Maps", error)
      })

    return () => {
      isMounted = false
    }
  }, [apiKey])

  useEffect(() => {
    if (!isMapsReady || !inputRef.current || autocompleteRef.current) {
      return
    }

    const mapsWindow = window as GoogleMapsWindow
    const Autocomplete = mapsWindow.google?.maps?.places?.Autocomplete

    if (!Autocomplete) {
      return
    }

    const autocomplete = new Autocomplete(inputRef.current, {
      componentRestrictions: { country: "za" },
      fields: ["place_id", "formatted_address", "name"],
      types: ["address"],
    })

    autocompleteRef.current = autocomplete

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      const description =
        place.formatted_address ?? place.name ?? inputRef.current?.value ?? ""

      if (!place.place_id || !description) {
        setSelectedPlace(null)
        return
      }

      setInputValue(description)
      setSelectedPlace({
        description,
        place_id: place.place_id,
      })
    })

    return () => {
      listener.remove()
      autocompleteRef.current = null
    }
  }, [isMapsReady])

  if (!hasApiKey) {
    return null
  }

  const handleGetEstimate = () => {
    if (!selectedPlace) {
      alert("Please select an address first")
      return
    }

    const params = new URLSearchParams({
      place_id: selectedPlace.place_id,
      address: selectedPlace.description,
    })

    sendGTMEvent({
      event: "get_my_estimate_click",
      address: selectedPlace.description,
      place_id: selectedPlace.place_id,
    })

    router.push(`/estimate?${params.toString()}`)
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-card border border-border">
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(event) => {
              const value = event.target.value
              setInputValue(value)
              if (selectedPlace && value !== selectedPlace.description) {
                setSelectedPlace(null)
              }
            }}
            placeholder="Enter your address..."
            className="h-14 pl-12 pr-4 text-base bg-secondary border-0"
            autoComplete="off"
            disabled={!isMapsReady}
          />
        </div>
        <Button
          onClick={handleGetEstimate}
          disabled={!selectedPlace}
          className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold"
        >
          Get My Estimate
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-4">Free estimate • No commitment • Takes 2 minutes</p>
    </div>
  )
}
