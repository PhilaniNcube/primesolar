import BatteriesWrapper from "@/components/admin/batteries-wrapper";
import { BatteriesTableSkeleton } from "@/components/admin/batteries-table-skeleton";
import { Suspense } from "react";

export default function BatteriesPage() {
  return (
    <Suspense fallback={<BatteriesTableSkeleton />}>
      <BatteriesWrapper />
    </Suspense>
  );
}
