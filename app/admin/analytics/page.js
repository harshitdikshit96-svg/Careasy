import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const TYPE_LABELS = {
  visit: "Page Visit",
  view: "Car View",
  whatsapp: "WhatsApp Click",
  call: "Call Click",
};

const TYPE_ICONS = {
  visit: "👁",
  view: "🚗",
  whatsapp: "💬",
  call: "📞",
};

export default async function AdminAnalyticsPage() {
  const [
    uniqueVisitors,
    whatsappClicks,
    carViews,
    callClicks,
    recentActivity,
    topCarViews,
  ] = await Promise.all([
    prisma.analytics.findMany({
      where: { type: "visit" },
      select: { sessionId: true },
      distinct: ["sessionId"],
    }),
    prisma.analytics.count({ where: { type: "whatsapp" } }),
    prisma.analytics.count({ where: { type: "view" } }),
    prisma.analytics.count({ where: { type: "call" } }),
    prisma.analytics.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { car: { select: { brand: true, model: true, year: true } } },
    }),
    prisma.analytics.groupBy({
      by: ["carId"],
      where: { type: "view", carId: { not: null } },
      _count: { carId: true },
      orderBy: { _count: { carId: "desc" } },
      take: 8,
    }),
  ]);

  // Enrich top cars
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

  const maxViews = topCars[0]?.views ?? 1;

  const stats = [
    { label: "Unique Visitors", value: uniqueVisitors.length, icon: "👁", color: "bg-blue-500" },
    { label: "WhatsApp Clicks", value: whatsappClicks, icon: "💬", color: "bg-emerald-500" },
    { label: "Car Views", value: carViews, icon: "🚗", color: "bg-amber-500" },
    { label: "Call Clicks", value: callClicks, icon: "📞", color: "bg-purple-500" },
  ];

  function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Analytics</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Lead Pulse</h1>
        </div>
        <Link
          href="/admin/dashboard"
          className="rounded-lg border border-slate-200 px-5 py-3 text-center font-black text-slate-700 hover:border-emerald-500"
        >
          ← Inventory
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className={`${color} px-5 py-3`}>
              <span className="text-2xl">{icon}</span>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-1 text-4xl font-black text-slate-950">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Top viewed cars bar chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-black text-slate-950">Top Viewed Cars</h2>
          {topCars.length === 0 ? (
            <p className="text-slate-500">No views tracked yet.</p>
          ) : (
            <div className="space-y-4">
              {topCars.map(({ carId, views, car }) => (
                <div key={carId}>
                  <div className="mb-1 flex justify-between text-sm font-bold text-slate-700">
                    <span>
                      {car ? `${car.brand} ${car.model} ${car.year}` : carId}
                    </span>
                    <span className="text-emerald-600">{views} views</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-2.5 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${(views / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity feed */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-black text-slate-950">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-slate-500">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <span className="mt-0.5 text-xl leading-none">{TYPE_ICONS[event.type] ?? "•"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-950">
                      {TYPE_LABELS[event.type] ?? event.type}
                      {event.car && (
                        <span className="ml-1 font-semibold text-slate-600">
                          — {event.car.brand} {event.car.model}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400">
                      Session {event.sessionId?.slice(-8) ?? "unknown"} • {timeAgo(event.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
