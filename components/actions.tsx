"use server";

import { createClient } from "@/lib/utils/supabase/server";

export async function login(email: string, password: string): Promise<number> {
  const supabase = await createClient();

  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  console.log(error);

  if (error) {
    return error.status || 400;
  } else {
    return 200;
  }
}

export async function signup(email: string, password: string): Promise<number> {
  const supabase = await createClient();

  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return error.status || 400;
  } else {
    return 200;
  }
}
