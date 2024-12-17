import { NextRequest, NextResponse } from "next/server";
import { CreateClient } from "@/lib/utils/supabase/client";

export async function middleware(req: NextRequest) {
  const supabase = CreateClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/lobby", "/lobby/create", "/play", "/results"],
};
