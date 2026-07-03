import Link from "next/link";
import { prisma } from "@/lib/db";
import { serializeCar } from "@/lib/carSerializer";
import AdminInventory from "./AdminInventory";

function formatPriceServer(v) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(v);
}

export default async function AdminDashboardPage() {
  const dbCars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
  const cars = dbCars.map(serializeCar);

  const total = cars.length;
  const verified = cars.filter((c) => c.verified).length;
  const financed = cars.filter((c) => c.finance).length;
  const avgPrice = total ? Math.round(cars.reduce((s, c) => s + c.price, 0) / total) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
            Admin dashboard
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Inventory Control</h1>
        </div>
        <Link
          href="/admin/analytics"
          className="rounded-lg bg-slate-950 px-5 py-3 text-center font-black text-white hover:bg-emerald-600"
        >
          View Analytics
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Cars", value: total },
          { label: "Verified", value: verified },
          { label: "Finance Ready", value: financed },
          { label: "Avg Price", value: formatPriceServer(avgPrice) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <AdminInventory cars={cars} />
    </div>
  );
}
