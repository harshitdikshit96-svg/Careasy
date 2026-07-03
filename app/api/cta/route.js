import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    type: body.type ?? "whatsapp",
    capturedAt: new Date().toISOString(),
  });
}
