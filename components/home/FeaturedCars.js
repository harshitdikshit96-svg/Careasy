import CarCard from "@/components/listings/CarCard";
import { cars } from "@/lib/mockCars";

export default function FeaturedCars() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
            Fresh inventory
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Featured Cars
          </h2>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cars.slice(0, 6).map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
}
