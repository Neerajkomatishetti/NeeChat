//eslint-disable-next-line @typescript-eslint/no-unused-vars
"use server";
import { supabase } from "@/lib/supabase";

export default async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  console.log(password);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  // TOD: Implement login logic
  return { success: true, error: null };
}
