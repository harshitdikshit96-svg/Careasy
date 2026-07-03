import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required." }, { status: 400 });
  }

  const trimmed = username.trim().toLowerCase();

  if (trimmed.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters." }, { status: 400 });
  }
  if (password.length < 4) {
    return NextResponse.json({ error: "Password must be at least 4 characters." }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: { username: trimmed, password, role: "user" },
    });

    const response = NextResponse.json({ ok: true, username: user.username });
    response.cookies.set("user", user.username, { httpOnly: true, path: "/", sameSite: "lax" });
    response.cookies.set("user_auth", "true", { httpOnly: true, path: "/", sameSite: "lax" });
    return response;
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Username already taken." }, { status: 409 });
    }
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
  }
}
