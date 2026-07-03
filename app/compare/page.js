import CompareBuilder from "@/components/compare/CompareBuilder";
import { prisma } from "@/lib/db";
import { serializeCar } from "@/lib/carSerializer";

export default async function ComparePage({ searchParams }) {
  const params = await searchParams;

  const dbCars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
  const cars = dbCars.map(serializeCar);

  const initialIds = params?.cars
    ? params.cars.split(",").filter((id) => cars.some((car) => car.id === id))
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Compare cars</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Make the shortlist obvious
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Search and add up to three cars. Trending picks below to get you started.
        </p>
      </div>
      <CompareBuilder cars={cars} initialIds={initialIds.slice(0, 3)} />
    </div>
  );
}
