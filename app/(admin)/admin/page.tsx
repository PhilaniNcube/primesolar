import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Battery, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

const stats = [
  {
    title: "Total Solar Panels",
    value: "24",
    description: "Active panel models",
    icon: Sun,
    trend: "+2 this month",
    trendUp: true,
  },
  {
    title: "Battery Options",
    value: "12",
    description: "Available configurations",
    icon: Battery,
    trend: "+1 this month",
    trendUp: true,
  },
  {
    title: "Total Leads",
    value: "1,284",
    description: "Across all channels",
    icon: Users,
    trend: "+18% vs last month",
    trendUp: true,
  },
  {
    title: "Conversion Rate",
    value: "12.4%",
    description: "Lead to customer",
    icon: TrendingUp,
    trend: "-2% vs last month",
    trendUp: false,
  },
]

const recentLeads = [
  { name: "John Smith", email: "john@example.com", location: "Cape Town", date: "2 hours ago" },
  { name: "Sarah Johnson", email: "sarah@example.com", location: "Johannesburg", date: "5 hours ago" },
  { name: "Mike Peters", email: "mike@example.com", location: "Durban", date: "1 day ago" },
  { name: "Lisa Brown", email: "lisa@example.com", location: "Pretoria", date: "1 day ago" },
  { name: "David Wilson", email: "david@example.com", location: "Port Elizabeth", date: "2 days ago" },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the PrimeSolar admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className={`mt-2 flex items-center text-xs ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                {stat.trendUp ? <ArrowUpRight className="mr-1 size-3" /> : <ArrowDownRight className="mr-1 size-3" />}
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{lead.location}</p>
                    <p className="text-xs text-muted-foreground">{lead.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <a
                href="/admin/solar-panels"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
              >
                <Sun className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Manage Solar Panels</p>
                  <p className="text-xs text-muted-foreground">Add, edit, or remove panel options</p>
                </div>
              </a>
              <a
                href="/admin/batteries"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
              >
                <Battery className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Manage Batteries</p>
                  <p className="text-xs text-muted-foreground">Configure battery options and pricing</p>
                </div>
              </a>
              <a
                href="/admin/leads"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
              >
                <Users className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">View All Leads</p>
                  <p className="text-xs text-muted-foreground">Review and manage customer inquiries</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
