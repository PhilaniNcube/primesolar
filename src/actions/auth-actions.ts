"use server";

import { createClient } from "@/utils/supabase/server";
import { signUpSchema } from "@/utils/validation/auth";

export async function signUpAction(prev:unknown, formdata:FormData) {

  const supabase = createClient();

  const validatedFields = signUpSchema.safeParse({
    email: formdata.get('email'),
    password: formdata.get('password'),
    first_name: formdata.get('first_name'),
    last_name: formdata.get('last_name'),
  })

  if (!validatedFields.success) {
     return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // create a new user in the supabase database
  const {data, error} = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      emailRedirectTo: '/',
      data: {
        first_name: validatedFields.data.first_name,
        last_name: validatedFields.data.last_name,
      }
    }
  })

  if(error) {
    return {
      errors: {
        cause: [error.message]
      }
    }
  }

  return {
    user: data.user
  }




}
