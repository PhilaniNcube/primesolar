import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const inverters = sqliteTable("inverters", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  type: text("type").notNull(), // 'microinverter', 'string', 'hybrid'
  maxInputVoltage: integer("max_input_voltage").notNull(),
  efficiency: real("efficiency").notNull(),
  pricePerUnit: integer("price_per_unit").notNull(), // Stored in cents
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
});
