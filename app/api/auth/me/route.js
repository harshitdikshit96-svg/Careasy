import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const user = cookieStore.get("user")?.value;
  const userAuth = cookieStore.get("user_auth")?.value === "true";
  const isAdmin = cookieStore.get("authenticated")?.value === "true";

  if (!user || !userAuth) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: { username: user, role: isAdmin ? "admin" : "user" },
  });
}
