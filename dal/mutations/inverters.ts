"use server";

import { db } from "@/db";
import { inverters } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ServerActionResult } from "./types";
import { createInverterSchema, updateInverterSchema, deleteSchema } from "./types";

/**
 * Create a new inverter
 */
export async function createInverter(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = createInverterSchema.parse(rawData);

    const [inverter] = await db.insert(inverters).values(validatedData).returning();
    
    return {
      success: true,
      data: inverter,
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
      error: "Failed to create inverter",
    };
  }
}

/**
 * Update an existing inverter
 */
export async function updateInverter(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = updateInverterSchema.parse(rawData);
    const { id, ...updateData } = validatedData;

    const [inverter] = await db
      .update(inverters)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(inverters.id, id))
      .returning();

    if (!inverter) {
      return {
        success: false,
        error: "Inverter not found",
      };
    }

    return {
      success: true,
      data: inverter,
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
      error: "Failed to update inverter",
    };
  }
}

/**
 * Delete an inverter
 */
export async function deleteInverter(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { id } = deleteSchema.parse(rawData);

    await db.delete(inverters).where(eq(inverters.id, id));

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
      error: "Failed to delete inverter",
    };
  }
}
