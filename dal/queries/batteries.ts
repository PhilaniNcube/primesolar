"use server";

import { db } from "@/db";
import { batteries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getBatteries() {
  const results = await db
    .select()
    .from(batteries)
    .orderBy(desc(batteries.createdAt));

  return results;
}

export async function getBatteryById(id: string) {
  const battery = await db
    .select()
    .from(batteries)
    .where(eq(batteries.id, id))
    .limit(1)
    .get();

  return battery;
}
