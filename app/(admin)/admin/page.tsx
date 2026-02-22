import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Battery, Users } from "lucide-react"
import Link from "next/link"
import { RecentLeads } from "@/components/admin/recent-leads"
import { RecentLeadsSkeleton } from "@/components/admin/recent-leads-skeleton"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { DashboardStatsSkeleton } from "@/components/admin/dashboard-stats-skeleton"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the PrimeSolar admin dashboard</p>
      </div>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<RecentLeadsSkeleton />}>
          <RecentLeads />
        </Suspense>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link
                href="/admin/solar-panels"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
              >
                <Sun className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Manage Solar Panels</p>
                  <p className="text-xs text-muted-foreground">Add, edit, or remove panel options</p>
                </div>
              </Link>
              <Link
                href="/admin/batteries"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
              >
                <Battery className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Manage Batteries</p>
                  <p className="text-xs text-muted-foreground">Configure battery options and pricing</p>
                </div>
              </Link>
              <Link
                href="/admin/leads"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
              >
                <Users className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">View All Leads</p>
                  <p className="text-xs text-muted-foreground">Review and manage customer inquiries</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
