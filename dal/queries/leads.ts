"use server";

import { db } from "@/db";
import { leads } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getLeads() {
  const leadsList = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt));
    return leadsList;
}

export async function getLeadsPaginated(page: number = 1, pageSize: number = 10) {
  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(leads),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  return { data, total };
}

export async function getLeadById(id: string) {
  const lead = await db
    .select()
    .from(leads)
    .where(eq(leads.id, id))
    .limit(1)
    .get();
    return lead;   
}

export async function getDetailedLeadById(id: string) {
  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, id),
    with: {
      configuration: {
        with: {
          items: true,
        },
      },
    },
  });
  return lead ?? null;
}

export type DetailedLead = NonNullable<Awaited<ReturnType<typeof getDetailedLeadById>>>;

// infer the return type of getLeads for better typing in components
export type Lead = Awaited<ReturnType<typeof getLeads>>[number];
export type LeadsPaginatedResult = Awaited<ReturnType<typeof getLeadsPaginated>>;