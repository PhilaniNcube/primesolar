"use server";

import { db } from "@/db";
import { batteries } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ServerActionResult } from "./types";
import { createBatterySchema, updateBatterySchema, deleteSchema } from "./types";

/**
 * Create a new battery
 */
export async function createBattery(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = createBatterySchema.parse(rawData);

    const [battery] = await db.insert(batteries).values(validatedData).returning();
    
    return {
      success: true,
      data: battery,
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
      error: "Failed to create battery",
    };
  }
}

/**
 * Update an existing battery
 */
export async function updateBattery(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = updateBatterySchema.parse(rawData);
    const { id, ...updateData } = validatedData;

    const [battery] = await db
      .update(batteries)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(batteries.id, id))
      .returning();

    if (!battery) {
      return {
        success: false,
        error: "Battery not found",
      };
    }

    return {
      success: true,
      data: battery,
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
      error: "Failed to update battery",
    };
  }
}

/**
 * Delete a battery
 */
export async function deleteBattery(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { id } = deleteSchema.parse(rawData);

    await db.delete(batteries).where(eq(batteries.id, id));

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
      error: "Failed to delete battery",
    };
  }
}
