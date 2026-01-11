"use server";

import { db } from "@/db";
import { configurations } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ServerActionResult } from "./types";
import { createConfigurationSchema, updateConfigurationSchema, deleteSchema } from "./types";

/**
 * Create a new configuration
 */
export async function createConfiguration(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = createConfigurationSchema.parse(rawData);

    // Parse JSON strings back to objects
    const dataToInsert = {
      ...validatedData,
      googleSolarData: validatedData.googleSolarData ? JSON.parse(validatedData.googleSolarData) : null,
      roofSegmentStats: validatedData.roofSegmentStats ? JSON.parse(validatedData.roofSegmentStats) : null,
      estimatedAnnualConsumption: validatedData.estimatedAnnualConsumption || null,
    };

    const [configuration] = await db.insert(configurations).values(dataToInsert).returning();
    
    return {
      success: true,
      data: configuration,
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
      error: "Failed to create configuration",
    };
  }
}

/**
 * Update an existing configuration
 */
export async function updateConfiguration(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = updateConfigurationSchema.parse(rawData);
    const { id, ...updateData } = validatedData;

    // Parse JSON strings back to objects
    const dataToUpdate = {
      ...updateData,
      googleSolarData: updateData.googleSolarData ? JSON.parse(updateData.googleSolarData) : undefined,
      roofSegmentStats: updateData.roofSegmentStats ? JSON.parse(updateData.roofSegmentStats) : undefined,
      estimatedAnnualConsumption: updateData.estimatedAnnualConsumption || null,
      updatedAt: new Date(),
    };

    const [configuration] = await db
      .update(configurations)
      .set(dataToUpdate)
      .where(eq(configurations.id, id))
      .returning();

    if (!configuration) {
      return {
        success: false,
        error: "Configuration not found",
      };
    }

    return {
      success: true,
      data: configuration,
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
      error: "Failed to update configuration",
    };
  }
}

/**
 * Delete a configuration
 */
export async function deleteConfiguration(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { id } = deleteSchema.parse(rawData);

    await db.delete(configurations).where(eq(configurations.id, id));

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
      error: "Failed to delete configuration",
    };
  }
}
