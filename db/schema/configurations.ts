import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { configurationItems } from "./configuration-items";
import { leads } from "./leads";

export const configurations = sqliteTable("configurations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  googleSolarData: text("google_solar_data", { mode: "json" }), // Store raw Google Solar API response
  roofSegmentStats: text("roof_segment_stats", { mode: "json" }), // Cached calculations
  estimatedAnnualConsumption: integer("estimated_annual_consumption"), // User input in kWh
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const configurationsRelations = relations(configurations, ({ many, one }) => ({
  items: many(configurationItems),
  lead: one(leads, {
    fields: [configurations.id],
    references: [leads.configurationId],
  }),
}));
