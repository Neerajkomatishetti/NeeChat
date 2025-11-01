"use server";
import { supabase } from "@/lib/supabase";

export const login = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  // TOD: Implement login logic
  return { success: true, error: null };
};
