import { getDashboardStats } from "@/dal/queries/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Battery, Users, TrendingUp, ArrowUpRight } from "lucide-react"

export async function DashboardStats() {
  const stats = await getDashboardStats()

  const cards = [
    {
      title: "Total Solar Panels",
      value: stats.solarPanels.toString(),
      description: "Active panel models",
      icon: Sun,
    },
    {
      title: "Battery Options",
      value: stats.batteries.toString(),
      description: "Available configurations",
      icon: Battery,
    },
    {
      title: "Total Leads",
      value: stats.totalLeads.toLocaleString(),
      description: "Across all channels",
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      description: "Quote sent vs total leads",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 size-3" />
              Live data
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
