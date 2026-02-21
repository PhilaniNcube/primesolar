"use server";

import { db } from "@/db";
import { inverters } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getInverters() {
  const results = await db
    .select()
    .from(inverters)
    .orderBy(desc(inverters.createdAt));

  return results;
}

export async function getInverterById(id: string) {
  const inverter = await db
    .select()
    .from(inverters)
    .where(eq(inverters.id, id))
    .limit(1)
    .get();

  return inverter;
}
