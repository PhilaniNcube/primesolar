export function StatsSection() {
  const stats = [
    { value: "5,000+", label: "Installations Completed", company: "Gauteng" },
    { value: "R2.5B", label: "Customer Savings", company: "Western Cape" },
    { value: "98%", label: "Customer Satisfaction", company: "KwaZulu-Natal" },
    { value: "15yr", label: "Average System Lifespan", company: "Nationwide" },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border bg-card/50">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-8">Trusted by homeowners across South Africa</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
              <div className="text-xs text-primary">{stat.company}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
