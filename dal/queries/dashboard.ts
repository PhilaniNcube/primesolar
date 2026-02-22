"use server";

import { db } from "@/db";
import { batteries, leads, solarPanels } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getDashboardStats() {
  const [panelCount, batteryCount, leadCount, quotedCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(solarPanels),
    db.select({ count: sql<number>`count(*)` }).from(batteries),
    db.select({ count: sql<number>`count(*)` }).from(leads),
    db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(eq(leads.status, "quote_sent")),
  ]);

  const totalLeads = Number(leadCount[0]?.count ?? 0);
  const totalQuoted = Number(quotedCount[0]?.count ?? 0);
  const conversionRate =
    totalLeads > 0 ? ((totalQuoted / totalLeads) * 100).toFixed(1) : "0.0";

  return {
    solarPanels: Number(panelCount[0]?.count ?? 0),
    batteries: Number(batteryCount[0]?.count ?? 0),
    totalLeads,
    conversionRate,
  };
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;
