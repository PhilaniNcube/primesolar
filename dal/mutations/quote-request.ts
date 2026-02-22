"use server";

import { createElement } from "react";
import { db } from "@/db";
import { configurations, configurationItems, leads } from "@/db/schema";
import type { ServerActionResult } from "./types";
import { quoteRequestSchema } from "./types";
import type { QuoteRequestInput } from "./types";
import { z } from "zod";
import { sendReactEmail, ADMIN_EMAIL } from "@/lib/email";
import { NewLeadEmail } from "@/emails/new-lead";

/**
 * Submit a quote request: creates a configuration with items and a lead in one go.
 */
export async function submitQuoteRequest(
  input: QuoteRequestInput
): Promise<ServerActionResult> {
  try {
    const validated = quoteRequestSchema.parse(input);

    // 1. Create the configuration
    const [configuration] = await db
      .insert(configurations)
      .values({
        address: validated.address,
        latitude: validated.latitude,
        longitude: validated.longitude,
        googleSolarData: validated.googleSolarData ?? null,
      })
      .returning();

    // 2. Create configuration items (panel, battery, inverter)
    await db.insert(configurationItems).values([
      {
        configurationId: configuration.id,
        itemType: "panel",
        itemId: validated.panelId,
        quantity: validated.panelQuantity,
      },
      {
        configurationId: configuration.id,
        itemType: "battery",
        itemId: validated.batteryId,
        quantity: validated.batteryQuantity,
      },
      {
        configurationId: configuration.id,
        itemType: "inverter",
        itemId: validated.inverterId,
        quantity: 1,
      },
    ]);

    // 3. Create the lead
    const [lead] = await db
      .insert(leads)
      .values({
        configurationId: configuration.id,
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone || null,
        status: "new",
      })
      .returning();

    // 4. Send lead notification email to admin (fire-and-forget)
    void sendReactEmail({
      to: ADMIN_EMAIL,
      subject: `New Quote Request: ${lead.firstName} ${lead.lastName}`,
      react: createElement(NewLeadEmail, {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        configurationId: lead.configurationId,
        submittedAt: lead.createdAt,
      }),
    }).catch((err) =>
      console.error("[submitQuoteRequest] Failed to send notification email:", err)
    );

    return {
      success: true,
      data: { lead, configuration },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(", "),
      };
    }
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to submit quote request",
    };
  }
}
