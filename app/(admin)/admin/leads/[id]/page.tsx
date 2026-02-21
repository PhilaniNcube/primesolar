import React from 'react'
import { Suspense } from 'react'
import LeadDetail from '@/components/admin/lead-detail'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function LeadDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl lg:col-span-2" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

const LeadDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div className="space-y-4">
      {/* Static breadcrumb back-link */}
      <Link
        href="/admin/leads"
        className="-ml-2 inline-flex h-7 items-center gap-1 rounded-none px-2.5 text-xs font-medium transition-all hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to Leads
      </Link>

      <Suspense fallback={<LeadDetailSkeleton />}>
        <LeadDetail paramsPromise={params} />
      </Suspense>
    </div>
  )
}

export default LeadDetailPage