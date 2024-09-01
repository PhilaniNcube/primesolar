import { z } from "zod";

const addressSchema = z.object({
  address: z.string(),
});

export async function getGPSCoordinatesAction(prev:unknown, formData:FormData) {

  const validatedFields = addressSchema.safeParse({
    address: formData.get("address") as string,
  });

  if (!validatedFields.success) {
    throw new Error("Invalid address");
  }

  // call the geocoding api to get the coordinates



}
