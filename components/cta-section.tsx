"use client"

import { AddressInput } from "./address-input"

export function CTASection() {
 

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
          Ready to break free from load-shedding?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Get your free personalised solar estimate in under 2 minutes. No obligation, no pressure—just honest numbers.
        </p>

  <AddressInput />
      </div>
    </section>
  )
}
