import LeadsList from "@/components/admin/leads-list";
import { LeadsTableSkeleton } from "@/components/admin/leads-table-skeleton";
import { Users } from "lucide-react";
import { Suspense } from "react";

interface LeadsPageProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  return (
    <div className="space-y-6">
      {/* Static shell — renders immediately, no data dependency */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          </div>
          <p className="text-sm text-muted-foreground pl-11">
            View and manage solar installation enquiries submitted through the
            site.
          </p>
        </div>
      </div>

      {/* Data shell — streams in once the server component resolves */}
      <Suspense fallback={<LeadsTableSkeleton />}>
        <LeadsList searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  );
}
