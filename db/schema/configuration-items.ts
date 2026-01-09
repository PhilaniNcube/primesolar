import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { configurations } from "./configurations";

export const configurationItems = sqliteTable("configuration_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  configurationId: text("configuration_id")
    .notNull()
    .references(() => configurations.id, { onDelete: "cascade" }),
  itemType: text("item_type").notNull(), // 'panel', 'battery', 'inverter'
  itemId: text("item_id").notNull(), // UUID of the hardware
  quantity: integer("quantity").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const configurationItemsRelations = relations(configurationItems, ({ one }) => ({
  configuration: one(configurations, {
    fields: [configurationItems.configurationId],
    references: [configurations.id],
  }),
}));
