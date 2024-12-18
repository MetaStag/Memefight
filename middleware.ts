import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/utils/supabase/middleware";

export async function middleware(req: NextRequest) {
  return await updateSession(req);
}

export const config = {
  matcher: ["/lobby", "/lobby/create", "/play", "/results"],
};
