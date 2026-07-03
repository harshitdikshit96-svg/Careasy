import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("user");
  response.cookies.delete("user_auth");
  response.cookies.delete("authenticated");
  return response;
}
