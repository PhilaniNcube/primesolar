import { cache } from "react";
import { createClient } from "../supabase/server";



export const currentUser = cache(async () => {
  const supabase = createClient();

  const {data:{user}} = await  supabase.auth.getUser();

  return user;
});


export async function isAdmin() {
  const supabase = createClient();


  const {data} = await supabase.rpc('is_admin')

  return data;

}
