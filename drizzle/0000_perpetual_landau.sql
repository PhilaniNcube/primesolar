DO $$ BEGIN
 CREATE TYPE "public"."battery_chemistry" AS ENUM('lithium-ion', 'lead-acid', 'nickel-cadmium');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."inverter_type" AS ENUM('hybrid', 'micro', 'string', 'power optimizer', 'grid-tied', 'off-grid', 'single-phase', 'three-phase');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "primesolar_battery" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"manufacturer" varchar(256) NOT NULL,
	"battery_chemistry" "battery_chemistry" NOT NULL,
	"capacity" numeric(5, 2) NOT NULL,
	"voltage" numeric(5, 2) NOT NULL,
	"depth_of_discharge" numeric(5, 2) NOT NULL,
	"cycle_life" numeric(5, 2) NOT NULL,
	"weight" numeric(5, 2) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"specs" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "primesolar_inverter" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"manufacturer" varchar(256) NOT NULL,
	"type" "inverter_type" NOT NULL,
	"size" varchar(256) NOT NULL,
	"voltage" numeric(5, 2) NOT NULL,
	"efficiency" numeric(5, 2) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"specs" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "primesolar_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "primesolar_solar_panel" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"manufacturer" varchar(256) NOT NULL,
	"wattage" numeric(5, 2) NOT NULL,
	"cell_technology" varchar(256) NOT NULL,
	"width" numeric(5, 2) NOT NULL,
	"height" numeric(5, 2) NOT NULL,
	"weight" numeric(5, 2) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"specs" jsonb
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "primesolar_post" ("name");