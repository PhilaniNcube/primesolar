"use server";

import { db } from "@/db";
import { solarPanels } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getSolarPanels() {
  const panels = await db
    .select()
    .from(solarPanels)
    .orderBy(desc(solarPanels.createdAt));
  
  return panels;
}
