"use server";

import { createClient } from "@/lib/utils/supabase/server";

export async function login(email: string, password: string): Promise<string> {
  const supabase = await createClient();

  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error); // temp
    return error.code || "Unknown error";
  } else {
    return "Logged in Succesfully";
  }
}

export async function signup(email: string, password: string): Promise<string> {
  const supabase = await createClient();

  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error); // temp
    return error.code || "Unknown error";
  } else {
    return "Sign up successful";
  }
}
