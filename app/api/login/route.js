import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  if (body.username === "admin" && body.password === "cars123") {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("authenticated", "true", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
