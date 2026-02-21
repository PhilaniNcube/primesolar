import { getLeadsPaginated } from '@/dal/queries/leads';
import React from 'react'
import LeadsClientTable from './leads-client-table';

interface LeadsListProps {
searchParamsPromise: Promise<{ page?: string; pageSize?: string }>;
}

const LeadsList = async ({ searchParamsPromise }: LeadsListProps) => {
  const rawParams = await searchParamsPromise;
  const page = Math.max(1, Number(rawParams.page ?? 1));
  const pageSize = Math.min(100, Math.max(5, Number(rawParams.pageSize ?? 10)));
  const { data, total } = await getLeadsPaginated(page, pageSize);

  return (
    <div>
      <LeadsClientTable leads={data} total={total} page={page} pageSize={pageSize} />
    </div>
  )
}

export default LeadsList