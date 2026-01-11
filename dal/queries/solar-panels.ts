"use server";

import { db } from "@/db";
import { solarPanels } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getSolarPanels() {
  const panels = await db
    .select()
    .from(solarPanels)
    .orderBy(desc(solarPanels.createdAt));
  
  return panels;
}

export async function getSolarPanelById(id: string) {
  const panel = await db
    .select()
    .from(solarPanels)
    .where(eq(solarPanels.id, id))
    .limit(1)
    .get();
    return panel;   
}