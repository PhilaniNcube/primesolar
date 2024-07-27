"use server";

import { createClient } from "@/utils/supabase/server";
import { loginSchema, signUpSchema } from "@/utils/validation/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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


export async function loginAction(prev:unknown, formdata:FormData) {

  const supabase = createClient();

  const validatedFields = loginSchema.safeParse({
    email: formdata.get('email'),
    password: formdata.get('password'),
  })


  if (!validatedFields.success) {
     return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // login the user
  const {data, error} = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
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


export const logoutAction = async () => {
  const supabase = createClient();

  await supabase.auth.signOut();
 revalidatePath("/", "layout");
  redirect('/');
}
