import { Sun, Battery, Smartphone, Leaf, Banknote, Clock } from "lucide-react"

export function FeaturesGrid() {
  const features = [
    {
      icon: Sun,
      title: "Solar Irradiation Data",
      description: "Precise calculations using historical weather data specific to your location in South Africa.",
    },
    {
      icon: Battery,
      title: "Battery Storage Options",
      description: "Configure backup power solutions to keep you running during load-shedding and at night.",
    },
    {
      icon: Smartphone,
      title: "Smart Monitoring",
      description: "Track your system's performance and energy production in real-time via our mobile app.",
    },
    {
      icon: Leaf,
      title: "Carbon Offset",
      description: "See your environmental impact and contribution to a cleaner South Africa.",
    },
    {
      icon: Banknote,
      title: "Financing Options",
      description: "Flexible payment plans and financing solutions to fit your budget. R0 upfront options available.",
    },
    {
      icon: Clock,
      title: "Quick Installation",
      description: "Most residential installations completed within 1-2 days with minimal disruption.",
    },
  ]

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-medium text-primary mb-4 block">Features</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Everything you need for energy independence
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our platform combines cutting-edge technology with local expertise to deliver the most accurate solar
              estimates and installations in South Africa.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl bg-secondary border border-border overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Sun className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Interactive Configurator</h3>
                  <p className="text-muted-foreground mb-6">Customize your system with our easy-to-use tool</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Panel Count</span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Battery Size</span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Inverter Type</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
