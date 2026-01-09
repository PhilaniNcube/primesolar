import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { configurations } from "./configurations";

export const leads = sqliteTable("leads", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  configurationId: text("configuration_id")
    .notNull()
    .references(() => configurations.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").notNull().default("new"), // 'new', 'contacted', 'quote_sent'
  submittedAt: integer("submitted_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const leadsRelations = relations(leads, ({ one }) => ({
  configuration: one(configurations, {
    fields: [leads.configurationId],
    references: [configurations.id],
  }),
}));
