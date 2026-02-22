"use server";

import { createElement } from "react";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import type { ServerActionResult } from "./types";
import {
  createLeadSchema,
  updateLeadSchema,
  deleteSchema,
  updateLeadStatusSchema,
} from "./types";
import { sendReactEmail, ADMIN_EMAIL } from "@/lib/email";
import { NewLeadEmail } from "@/emails/new-lead";

/**
 * Create a new lead
 */
export async function createLead(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = createLeadSchema.parse(rawData);

    // Convert empty string to null for phone
    const dataToInsert = {
      ...validatedData,
      phone: validatedData.phone || null,
    };

    const [lead] = await db.insert(leads).values(dataToInsert).returning();

    // Send lead notification email to admin (fire-and-forget)
    void sendReactEmail({
      to: ADMIN_EMAIL,
      subject: `New Lead: ${lead.firstName} ${lead.lastName}`,
      react: createElement(NewLeadEmail, {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        configurationId: lead.configurationId,
        submittedAt: lead.createdAt,
      }),
    });

    return {
      success: true,
      data: lead,
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
      error: "Failed to create lead",
    };
  }
}

/**
 * Update an existing lead
 */
export async function updateLead(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = updateLeadSchema.parse(rawData);
    const { id, ...updateData } = validatedData;

    // Convert empty string to null for phone
    const dataToUpdate = {
      ...updateData,
      phone: updateData.phone || null,
    };

    const [lead] = await db
      .update(leads)
      .set(dataToUpdate)
      .where(eq(leads.id, id))
      .returning();

    if (!lead) {
      return {
        success: false,
        error: "Lead not found",
      };
    }

    revalidateTag(`lead-${id}`, 'max')
    revalidateTag("leads", 'max')

    return {
      success: true,
      data: lead,
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
      error: "Failed to update lead",
    };
  }
}

/**
 * Delete a lead
 */
export async function deleteLead(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { id } = deleteSchema.parse(rawData);

    await db.delete(leads).where(eq(leads.id, id));

    revalidateTag(`lead-${id}`, 'max')
    revalidateTag("leads", 'max')

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
      error: "Failed to delete lead",
    };
  }
}

/**
 * Update lead status
 */
export async function updateLeadStatus(
  prevState: unknown,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { id, status } = updateLeadStatusSchema.parse(rawData);

    const [lead] = await db
      .update(leads)
      .set({ status })
      .where(eq(leads.id, id))
      .returning();

    if (!lead) {
      return {
        success: false,
        error: "Lead not found",
      };
    }

    revalidateTag(`lead-${lead.id}`, 'max')
    revalidateTag("leads", 'max')

    return {
      success: true,
      data: lead,
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
      error: "Failed to update lead status",
    };
  }
}
