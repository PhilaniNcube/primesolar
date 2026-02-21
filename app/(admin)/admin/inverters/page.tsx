import InvertersWrapper from "@/components/admin/inverters-wrapper"
import { InvertersTableSkeleton } from "@/components/admin/inverters-table-skeleton"
import { Suspense } from "react"

export default function InvertersPage() {
  return (
    <Suspense fallback={<InvertersTableSkeleton />}>
      <InvertersWrapper />
    </Suspense>
  )
}
