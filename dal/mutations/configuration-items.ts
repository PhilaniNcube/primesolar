"use server";

import { db } from "@/db";
import { configurationItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ServerActionResult } from "./types";
import {
  createConfigurationItemSchema,
  updateConfigurationItemSchema,
  deleteSchema,
  deleteConfigurationItemsSchema,
} from "./types";

/**
 * Create a new configuration item
 */
export async function createConfigurationItem(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = createConfigurationItemSchema.parse(rawData);

    const [item] = await db.insert(configurationItems).values(validatedData).returning();
    
    return {
      success: true,
      data: item,
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
      error: "Failed to create configuration item",
    };
  }
}

/**
 * Update an existing configuration item
 */
export async function updateConfigurationItem(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = updateConfigurationItemSchema.parse(rawData);
    const { id, ...updateData } = validatedData;

    const [item] = await db
      .update(configurationItems)
      .set(updateData)
      .where(eq(configurationItems.id, id))
      .returning();

    if (!item) {
      return {
        success: false,
        error: "Configuration item not found",
      };
    }

    return {
      success: true,
      data: item,
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
      error: "Failed to update configuration item",
    };
  }
}

/**
 * Delete a configuration item
 */
export async function deleteConfigurationItem(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { id } = deleteSchema.parse(rawData);

    await db.delete(configurationItems).where(eq(configurationItems.id, id));

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
      error: "Failed to delete configuration item",
    };
  }
}

/**
 * Delete all configuration items for a configuration
 */
export async function deleteConfigurationItems(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { configurationId } = deleteConfigurationItemsSchema.parse(rawData);

    await db.delete(configurationItems).where(eq(configurationItems.configurationId, configurationId));

    return {
      success: true,
      data: { configurationId },
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
      error: "Failed to delete configuration items",
    };
  }
}
