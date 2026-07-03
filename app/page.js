import Categories from "@/components/home/Categories";
import Hero from "@/components/home/Hero";
import TrendingCars from "@/components/home/TrendingCars";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CarCard from "@/components/listings/CarCard";
import { prisma } from "@/lib/db";
import { serializeCar } from "@/lib/carSerializer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredDb, trendingDb] = await Promise.all([
    prisma.car.findMany({ where: { featured: true }, take: 6, orderBy: { createdAt: "desc" } }),
    prisma.car.findMany({ orderBy: { updatedAt: "desc" }, take: 12 }),
  ]);

  // Fallback to first 6 if no featured
  const featuredCars = (featuredDb.length > 0
    ? featuredDb
    : await prisma.car.findMany({ take: 6, orderBy: { createdAt: "desc" } })
  ).map(serializeCar);

  const trendingCars = trendingDb.map(serializeCar);

  return (
    <>
      <Hero />
      <Categories />

      {/* Featured Cars */}
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
              Fresh inventory
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Featured Cars
            </h2>
          </div>
          <Link
            href="/listings"
            className="hidden rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-emerald-500 sm:block"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <TrendingCars cars={trendingCars} />
      <WhyChooseUs />
    </>
  );
}
