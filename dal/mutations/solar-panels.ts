"use server";

import { db } from "@/db";
import { solarPanels } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ServerActionResult } from "./types";
import { createSolarPanelSchema, updateSolarPanelSchema, deleteSchema } from "./types";

/**
 * Create a new solar panel
 */
export async function createSolarPanel(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = createSolarPanelSchema.parse(rawData);

    // Convert empty string to null for imageUrl
    const dataToInsert = {
      ...validatedData,
      imageUrl: validatedData.imageUrl || null,
    };

    const [panel] = await db.insert(solarPanels).values(dataToInsert).returning();
    
    return {
      success: true,
      data: panel,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to create solar panel",
    };
  }
}

/**
 * Update an existing solar panel
 */
export async function updateSolarPanel(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = updateSolarPanelSchema.parse(rawData);
    const { id, ...updateData } = validatedData;

    // Convert empty string to null for imageUrl
    const dataToUpdate = {
      ...updateData,
      imageUrl: updateData.imageUrl || null,
      updatedAt: new Date(),
    };

    const [panel] = await db
      .update(solarPanels)
      .set(dataToUpdate)
      .where(eq(solarPanels.id, id))
      .returning();

    if (!panel) {
      return {
        success: false,
        error: "Solar panel not found",
      };
    }

    return {
      success: true,
      data: panel,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to update solar panel",
    };
  }
}

/**
 * Delete a solar panel
 */
export async function deleteSolarPanel(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { id } = deleteSchema.parse(rawData);

    await db.delete(solarPanels).where(eq(solarPanels.id, id));

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to delete solar panel",
    };
  }
}
