import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username: username.trim().toLowerCase() },
  });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, username: user.username, role: user.role });
  response.cookies.set("user", user.username, { httpOnly: true, path: "/", sameSite: "lax" });
  response.cookies.set("user_auth", "true", { httpOnly: true, path: "/", sameSite: "lax" });

  if (user.role === "admin") {
    response.cookies.set("authenticated", "true", { httpOnly: true, path: "/", sameSite: "lax" });
  }

  return response;
}
