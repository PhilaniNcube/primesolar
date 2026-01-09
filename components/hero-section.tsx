"use client"

import { Zap, Shield, TrendingDown } from "lucide-react"
import { AddressInput } from "@/components/address-input"

export function HeroSection() {

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-primary/10 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Beat Load-Shedding Forever</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight text-balance mb-6">
            Your personalised solar solution starts <span className="text-primary">here</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Enter your address and we&apos;ll analyse your location using satellite imagery and solar irradiation data to
            generate a custom installation estimate tailored to your needs.
          </p>

          <AddressInput />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Energy Independence</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Reduce Bills by 80%</span>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-end">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">24/7 Power Security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
