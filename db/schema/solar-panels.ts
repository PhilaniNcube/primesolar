import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const solarPanels = sqliteTable("solar_panels", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  wattage: integer("wattage").notNull(), // e.g., 400W
  efficiency: real("efficiency").notNull(), // Percentage, e.g., 20.5
  dimensionsLengthMm: integer("dimensions_length_mm").notNull(),
  dimensionsWidthMm: integer("dimensions_width_mm").notNull(),
  pricePerUnit: integer("price_per_unit").notNull(), // Stored in cents
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull(),
});
