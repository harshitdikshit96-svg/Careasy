import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/analytics/track
// body: { type: "visit"|"view"|"whatsapp"|"call", carId?: string, sessionId: string }
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type, carId, sessionId } = body;

    if (!type || !sessionId) {
      return NextResponse.json({ error: "type and sessionId required" }, { status: 400 });
    }

    // For "visit" events, deduplicate by sessionId (only one visit per session)
    if (type === "visit") {
      const existing = await prisma.analytics.findFirst({
        where: { type: "visit", sessionId },
      });
      if (existing) {
        return NextResponse.json({ ok: true, deduplicated: true });
      }
    }

    await prisma.analytics.create({
      data: {
        type,
        sessionId,
        carId: carId || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/analytics/track error:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
