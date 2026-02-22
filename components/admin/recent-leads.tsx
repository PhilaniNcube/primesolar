import { getLeadsPaginated } from "@/dal/queries/leads"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

export async function RecentLeads() {
  const { data: leads } = await getLeadsPaginated(1, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Leads</CardTitle>
        <CardDescription>Latest customer inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.length === 0 && (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          )}
          {leads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {lead.firstName} {lead.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{lead.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground capitalize">{lead.status}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
