import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      totalVisits,
      totalWhatsapp,
      totalViews,
      totalCalls,
      recentActivity,
      topCarViews,
    ] = await Promise.all([
      // Unique visitors (distinct sessionIds with type=visit)
      prisma.analytics.findMany({
        where: { type: "visit" },
        select: { sessionId: true },
        distinct: ["sessionId"],
      }),

      // WhatsApp clicks total
      prisma.analytics.count({ where: { type: "whatsapp" } }),

      // Car views total
      prisma.analytics.count({ where: { type: "view" } }),

      // Call clicks total
      prisma.analytics.count({ where: { type: "call" } }),

      // Recent 20 events
      prisma.analytics.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: { car: { select: { brand: true, model: true, year: true } } },
      }),

      // Top 10 viewed cars
      prisma.analytics.groupBy({
        by: ["carId"],
        where: { type: "view", carId: { not: null } },
        _count: { carId: true },
        orderBy: { _count: { carId: "desc" } },
        take: 10,
      }),
    ]);

    // Enrich topCarViews with car details
    const carIds = topCarViews.map((r) => r.carId).filter(Boolean);
    const carDetails = await prisma.car.findMany({
      where: { id: { in: carIds } },
      select: { id: true, brand: true, model: true, year: true },
    });
    const carMap = Object.fromEntries(carDetails.map((c) => [c.id, c]));

    const topCars = topCarViews.map((r) => ({
      carId: r.carId,
      views: r._count.carId,
      car: carMap[r.carId] ?? null,
    }));

    return NextResponse.json({
      uniqueVisitors: totalVisits.length,
      whatsappClicks: totalWhatsapp,
      carViews: totalViews,
      callClicks: totalCalls,
      topCars,
      recentActivity: recentActivity.map((e) => ({
        id: e.id,
        type: e.type,
        carId: e.carId,
        car: e.car,
        sessionId: e.sessionId,
        createdAt: e.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
