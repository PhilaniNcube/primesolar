import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const batteries = sqliteTable("batteries", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  capacityKwh: real("capacity_kwh").notNull(), // e.g., 13.5 kWh
  maxContinuousPowerKw: real("max_continuous_power_kw").notNull(),
  weightKg: real("weight_kg").notNull(),
  pricePerUnit: integer("price_per_unit").notNull(), // Stored in cents
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
});
