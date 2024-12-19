"use server";

import { createClient } from "@/lib/utils/supabase/server";

export async function login(email: string, password: string): Promise<string> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return error.code || "unkwown_error";
  } else {
    return "success";
  }
}

export async function signup(email: string, password: string): Promise<string> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    return error.code || "unknown_error";
  } else {
    return "success";
  }
}
