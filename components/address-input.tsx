"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import type { SingleValue } from "react-select"

interface PlaceValue {
  label: string
  value: {
    description: string
    place_id: string
    structured_formatting: {
      main_text: string
      secondary_text: string
    }
  }
}

export function AddressInput() {
  const [selectedPlace, setSelectedPlace] = useState<SingleValue<PlaceValue>>(null)
  const router = useRouter()

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  if (!apiKey) {
    console.error("Google Maps API key is not set")
    return null
  }

  const handleGetEstimate = () => {
    if (!selectedPlace) {
      alert("Please select an address first")
      return
    }

    const params = new URLSearchParams({
      place_id: selectedPlace.value.place_id,
      address: selectedPlace.value.description,
    })

    router.push(`/estimate?${params.toString()}`)
  }

  console.log("Selected Place:", selectedPlace)

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-card border border-border">
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <GooglePlacesAutocomplete
            apiKey={apiKey}
            selectProps={{
              value: selectedPlace,
              onChange: setSelectedPlace,
              placeholder: "Enter your address in South Africa...",
              isClearable: true,
              className: "google-places-autocomplete bg-white",
              classNamePrefix: "google-places",
              styles: {
                control: (provided) => ({
                  ...provided,
                  height: "56px",
                  paddingLeft: "40px",
                  backgroundColor: "hsl(var(--secondary))",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "16px",
                  boxShadow: "none",
                  "&:hover": {
                    border: "none",
                  },
                }),
                input: (provided) => ({
                  ...provided,
                  color: "hsl(var(--foreground))",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "hsl(var(--muted-foreground))",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "hsl(var(--foreground))",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#ffffff",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  marginTop: "8px",
                  zIndex: 9999,
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "240px",
                  padding: "0",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused
                    ? "hsl(var(--secondary))"
                    : "transparent",
                  color: "hsl(var(--foreground))",
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                  "&:active": {
                    backgroundColor: "hsl(var(--secondary))",
                  },
                }),
                loadingIndicator: (provided) => ({
                  ...provided,
                  color: "hsl(var(--muted-foreground))",
                }),
                clearIndicator: (provided) => ({
                  ...provided,
                  color: "hsl(var(--muted-foreground))",
                  "&:hover": {
                    color: "hsl(var(--foreground))",
                  },
                }),
                dropdownIndicator: () => ({
                  display: "none",
                }),
                indicatorSeparator: () => ({
                  display: "none",
                }),
              },
            }}
            apiOptions={{
              region: "za",
            }}
            autocompletionRequest={{
              componentRestrictions: {
                country: "za",
              },
              types: ["address"],
            }}
            debounce={500}
          />
        </div>
        <Button 
          onClick={handleGetEstimate}
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
