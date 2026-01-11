"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ServerActionResult } from "./types";
import { createUserSchema, updateUserSchema, deleteSchema } from "./types";

/**
 * Create a new user
 */
export async function createUser(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = createUserSchema.parse(rawData);

    const [user] = await db.insert(users).values(validatedData).returning();
    
    return {
      success: true,
      data: user,
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
      error: "Failed to create user",
    };
  }
}

/**
 * Update an existing user
 */
export async function updateUser(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = updateUserSchema.parse(rawData);
    const { id, ...updateData } = validatedData;

    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: user,
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
      error: "Failed to update user",
    };
  }
}

/**
 * Delete a user
 */
export async function deleteUser(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { id } = deleteSchema.parse(rawData);

    await db.delete(users).where(eq(users.id, id));

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
      error: "Failed to delete user",
    };
  }
}
