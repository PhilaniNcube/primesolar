"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ServerActionResult } from "./types";
import { createUserSchema, updateUserSchema, deleteSchema } from "./types";

/**
 * Create a new user
 *
 * NOTE: For authentication-related user creation, prefer
 * `auth.api.signUpEmail` or `authClient.signUp.email` instead.
 * This function performs a raw DB insert.
 */
export async function createUser(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = createUserSchema.parse(rawData);

    const [newUser] = await db.insert(user).values(validatedData).returning();
    
    return {
      success: true,
      data: newUser,
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

    const [updatedUser] = await db
      .update(user)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();

    if (!updatedUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: updatedUser,
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

    await db.delete(user).where(eq(user.id, id));

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
