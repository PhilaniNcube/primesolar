"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, ArrowRight } from "lucide-react"

export function CTASection() {
  const [address, setAddress] = useState("")

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
          Ready to break free from load-shedding?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Get your free personalised solar estimate in under 2 minutes. No obligation, no pressure—just honest numbers.
        </p>

        <div className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-background border border-border">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-12 h-14 bg-secondary border-0 text-foreground placeholder:text-muted-foreground text-base"
              />
            </div>
            <Button className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold">
              Get My Estimate
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
