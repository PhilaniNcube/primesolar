CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "solar_panel" (
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
DROP TABLE "primesolar_post";--> statement-breakpoint
DROP TABLE "primesolar_solar_panel";--> statement-breakpoint
ALTER TABLE "primesolar_battery" RENAME TO "battery";--> statement-breakpoint
ALTER TABLE "primesolar_inverter" RENAME TO "inverter";