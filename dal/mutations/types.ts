import { z } from "zod";

// Server action return type
export type ServerActionResult<T = unknown> = {
  success: boolean;
  error?: string;
  data?: T;
};

// User mutations schemas
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export const updateUserSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Solar Panel mutations schemas
export const createSolarPanelSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  wattage: z.coerce.number().int().positive("Wattage must be positive"),
  efficiency: z.coerce.number().positive("Efficiency must be positive"),
  dimensionsLengthMm: z.coerce.number().int().positive("Length must be positive"),
  dimensionsWidthMm: z.coerce.number().int().positive("Width must be positive"),
  pricePerUnit: z.coerce.number().int().positive("Price must be positive"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const updateSolarPanelSchema = z.object({
  id: z.string().uuid("Invalid solar panel ID"),
  brand: z.string().min(1, "Brand is required").optional(),
  model: z.string().min(1, "Model is required").optional(),
  wattage: z.coerce.number().int().positive("Wattage must be positive").optional(),
  efficiency: z.coerce.number().positive("Efficiency must be positive").optional(),
  dimensionsLengthMm: z.coerce.number().int().positive("Length must be positive").optional(),
  dimensionsWidthMm: z.coerce.number().int().positive("Width must be positive").optional(),
  pricePerUnit: z.coerce.number().int().positive("Price must be positive").optional(),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type CreateSolarPanelInput = z.infer<typeof createSolarPanelSchema>;
export type UpdateSolarPanelInput = z.infer<typeof updateSolarPanelSchema>;

// Battery mutations schemas
export const createBatterySchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  capacityKwh: z.coerce.number().positive("Capacity must be positive"),
  maxContinuousPowerKw: z.coerce.number().positive("Max power must be positive"),
  weightKg: z.coerce.number().positive("Weight must be positive"),
  pricePerUnit: z.coerce.number().int().positive("Price must be positive"),
});

export const updateBatterySchema = z.object({
  id: z.string().uuid("Invalid battery ID"),
  brand: z.string().min(1, "Brand is required").optional(),
  model: z.string().min(1, "Model is required").optional(),
  capacityKwh: z.coerce.number().positive("Capacity must be positive").optional(),
  maxContinuousPowerKw: z.coerce.number().positive("Max power must be positive").optional(),
  weightKg: z.coerce.number().positive("Weight must be positive").optional(),
  pricePerUnit: z.coerce.number().int().positive("Price must be positive").optional(),
});

export type CreateBatteryInput = z.infer<typeof createBatterySchema>;
export type UpdateBatteryInput = z.infer<typeof updateBatterySchema>;

// Inverter mutations schemas
export const createInverterSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  type: z.enum(["microinverter", "string", "hybrid"], {
    message: "Type must be microinverter, string, or hybrid",
  }),
  maxInputVoltage: z.coerce.number().int().positive("Max input voltage must be positive"),
  efficiency: z.coerce.number().positive("Efficiency must be positive"),
  pricePerUnit: z.coerce.number().int().positive("Price must be positive"),
});

export const updateInverterSchema = z.object({
  id: z.string().uuid("Invalid inverter ID"),
  brand: z.string().min(1, "Brand is required").optional(),
  model: z.string().min(1, "Model is required").optional(),
  type: z.enum(["microinverter", "string", "hybrid"]).optional(),
  maxInputVoltage: z.coerce.number().int().positive("Max input voltage must be positive").optional(),
  efficiency: z.coerce.number().positive("Efficiency must be positive").optional(),
  pricePerUnit: z.coerce.number().int().positive("Price must be positive").optional(),
});

export type CreateInverterInput = z.infer<typeof createInverterSchema>;
export type UpdateInverterInput = z.infer<typeof updateInverterSchema>;

// Configuration mutations schemas
export const createConfigurationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  latitude: z.coerce.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.coerce.number().min(-180).max(180, "Invalid longitude"),
  googleSolarData: z.string().optional(),
  roofSegmentStats: z.string().optional(),
  estimatedAnnualConsumption: z.coerce.number().int().positive("Consumption must be positive").optional().or(z.literal("")),
});

export const updateConfigurationSchema = z.object({
  id: z.string().uuid("Invalid configuration ID"),
  address: z.string().min(1, "Address is required").optional(),
  latitude: z.coerce.number().min(-90).max(90, "Invalid latitude").optional(),
  longitude: z.coerce.number().min(-180).max(180, "Invalid longitude").optional(),
  googleSolarData: z.string().optional(),
  roofSegmentStats: z.string().optional(),
  estimatedAnnualConsumption: z.coerce.number().int().positive("Consumption must be positive").optional().or(z.literal("")),
});

export type CreateConfigurationInput = z.infer<typeof createConfigurationSchema>;
export type UpdateConfigurationInput = z.infer<typeof updateConfigurationSchema>;

// Configuration Item mutations schemas
export const createConfigurationItemSchema = z.object({
  configurationId: z.string().uuid("Invalid configuration ID"),
  itemType: z.enum(["panel", "battery", "inverter"], {
    message: "Item type must be panel, battery, or inverter",
  }),
  itemId: z.string().uuid("Invalid item ID"),
  quantity: z.coerce.number().int().positive("Quantity must be positive").optional(),
});

export const updateConfigurationItemSchema = z.object({
  id: z.string().uuid("Invalid configuration item ID"),
  itemType: z.enum(["panel", "battery", "inverter"]).optional(),
  itemId: z.string().uuid("Invalid item ID").optional(),
  quantity: z.coerce.number().int().positive("Quantity must be positive").optional(),
});

export const deleteConfigurationItemsSchema = z.object({
  configurationId: z.string().uuid("Invalid configuration ID"),
});

export type CreateConfigurationItemInput = z.infer<typeof createConfigurationItemSchema>;
export type UpdateConfigurationItemInput = z.infer<typeof updateConfigurationItemSchema>;

// Lead mutations schemas
export const createLeadSchema = z.object({
  configurationId: z.string().uuid("Invalid configuration ID"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  status: z.enum(["new", "contacted", "quote_sent"]).optional(),
});

export const updateLeadSchema = z.object({
  id: z.string().uuid("Invalid lead ID"),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional().or(z.literal("")),
  status: z.enum(["new", "contacted", "quote_sent"]).optional(),
});

export const updateLeadStatusSchema = z.object({
  id: z.string().uuid("Invalid lead ID"),
  status: z.enum(["new", "contacted", "quote_sent"], {
    message: "Status must be new, contacted, or quote_sent",
  }),
});

export const deleteSchema = z.object({
  id: z.string().uuid("Invalid ID"),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
