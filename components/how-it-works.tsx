import { MapPin, Satellite, Calculator, Wrench } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: "Enter Your Address",
      description: "Simply type in your South African address and our system will locate your property on the map.",
    },
    {
      icon: Satellite,
      title: "AI Roof Analysis",
      description:
        "We use satellite imagery to analyse your roof size, orientation, and shading to determine optimal panel placement.",
    },
    {
      icon: Calculator,
      title: "Custom Estimate",
      description:
        "Based on local solar irradiation data and your electricity usage, we calculate your potential savings and system size.",
    },
    {
      icon: Wrench,
      title: "Professional Installation",
      description:
        "Our certified installers handle everything from permits to commissioning, ensuring a hassle-free experience.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary mb-4 block">How it Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            From address to installation in 4 simple steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our intelligent platform makes going solar easier than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
