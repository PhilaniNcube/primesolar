// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration


import {

  jsonb,
  numeric,
  pgEnum,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const solar_panels = createTable(
  "solar_panel",
  {
    id: uuid("id").primaryKey().notNull(),
    name: varchar("name", { length: 256 }),
    manufacturer: varchar("manufacturer", { length: 256 }).notNull(),
    wattage: numeric("wattage", { precision: 5, scale: 2 }).notNull(),
    cell_technology: varchar("cell_technology", { length: 256 }).notNull(),
    width: numeric("width", { precision: 5, scale: 2 }).notNull(),
    height: numeric("height", { precision: 5, scale: 2 }).notNull(),
    weight: numeric("weight", { precision: 5, scale: 2 }).notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    specs: jsonb("specs"),
  }
)

export const inverterTypeEnum = pgEnum("inverter_type", ["hybrid", "micro", "string", "power optimizer", 'grid-tied', 'off-grid', 'single-phase', 'three-phase'])

export const inverters = createTable(
  "inverter",
  {
    id: uuid("id").primaryKey().notNull(),
    name: varchar("name", { length: 256 }),
    manufacturer: varchar("manufacturer", { length: 256 }).notNull(),
    type: inverterTypeEnum('type').notNull(),
    size: varchar("size", { length: 256 }).notNull(),
    voltage: numeric("voltage", { precision: 5, scale: 2 }).notNull(),
    efficiency: numeric("efficiency", { precision: 5, scale: 2 }).notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    specs: jsonb("specs"),
  }
)


// batteries, charge controllers, and solar panels

export const batteryChemistryEnum = pgEnum('battery_chemistry', ['lithium-ion', 'lead-acid', 'nickel-cadmium'])

export const batteries = createTable("battery", {
	id: uuid("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }),
	manufacturer: varchar("manufacturer", { length: 256 }).notNull(),
	battery_chemistry: batteryChemistryEnum("battery_chemistry").notNull(),
	capacity: numeric("capacity", { precision: 5, scale: 2 }).notNull(),
	nominal_voltage: numeric("voltage", { precision: 5, scale: 2 }).notNull(),
  depth_of_discharge: numeric("depth_of_discharge", { precision: 5, scale: 2 }).notNull(),
  cycle_life: numeric("cycle_life", { precision: 5, scale: 2 }).notNull(),
  weight: numeric("weight", { precision: 5, scale: 2 }).notNull(),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	specs: jsonb("specs"),
});


export const profiles = createTable('profiles', {
  id: uuid('id').primaryKey().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
  first_name: varchar('first_name', { length: 256 }).notNull(),
  last_name: varchar('last_name', { length: 256 }).notNull(),
})

export const admins = createTable('admins', {
  id: uuid('id').primaryKey().notNull(),
  profile_id: uuid('profile_id').notNull().references(() => profiles.id),
})
