"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "@/components/listings/CarCard";
import FilterBar from "@/components/listings/FilterBar";

const EMPTY_FILTERS = {
  brand: "", fuel: "", transmission: "", ownership: "", budget: "", kms: "", year: "",
};

function inBudget(price, budget) {
  if (!budget) return true;
  if (budget === "Under ₹2L") return price < 200000;
  if (budget === "₹2L–₹5L") return price >= 200000 && price < 500000;
  if (budget === "₹5L–₹10L") return price >= 500000 && price < 1000000;
  if (budget === "₹10L–₹20L") return price >= 1000000 && price < 2000000;
  if (budget === "Above ₹20L") return price >= 2000000;
  return true;
}

function inKms(mileage, kms) {
  if (!kms) return true;
  if (kms === "Under 30K") return mileage < 30000;
  if (kms === "30K–60K") return mileage >= 30000 && mileage < 60000;
  if (kms === "60K–90K") return mileage >= 60000 && mileage < 90000;
  if (kms === "Above 90K") return mileage >= 90000;
  return true;
}

function inYear(year, range) {
  if (!range) return true;
  if (range === "2023+") return year >= 2023;
  if (range === "2020–2022") return year >= 2020 && year <= 2022;
  if (range === "2017–2019") return year >= 2017 && year <= 2019;
  if (range === "Before 2017") return year < 2017;
  return true;
}

function ListingsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";

  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [inputQ, setInputQ] = useState(searchParams.get("q") ?? "");
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data) => {
        setAllCars(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return allCars.filter((car) => {
      if (q) {
        const lower = q.toLowerCase();
        const hay = `${car.brand} ${car.model} ${car.location} ${car.category} ${car.fuel}`.toLowerCase();
        if (!hay.includes(lower)) return false;
      }
      if (categoryParam) {
        const vals = [car.category, car.fuel, car.transmission].map((v) => v.toLowerCase());
        if (!vals.includes(categoryParam.toLowerCase())) return false;
      }
      if (filters.brand && car.brand !== filters.brand) return false;
      if (filters.fuel && car.fuel !== filters.fuel) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.ownership && car.ownership !== filters.ownership) return false;
      if (!inBudget(car.price, filters.budget)) return false;
      if (!inKms(car.mileage, filters.kms)) return false;
      if (!inYear(car.year, filters.year)) return false;
      return true;
    });
  }, [q, categoryParam, filters, allCars]);

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setQ("");
    setInputQ("");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Browse inventory</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">
          Used Cars{categoryParam ? ` — ${categoryParam}` : ""}
        </h1>
      </div>

      <div className="mb-6 space-y-3">
        <form onSubmit={(e) => { e.preventDefault(); setQ(inputQ); }} className="flex gap-2">
          <input
            value={inputQ}
            onChange={(e) => setInputQ(e.target.value)}
            placeholder="Search brand, model, city…"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <button type="submit" className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600">
            Search
          </button>
        </form>
        <FilterBar
          filters={filters}
          onChange={(key, val) => setFilters((p) => ({ ...p, [key]: val }))}
          onReset={resetFilters}
          totalResults={filtered.length}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-slate-100 h-28 sm:aspect-[3/4] sm:h-auto" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {filtered.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-2xl font-black text-slate-950">No cars found</p>
          <p className="mt-2 text-slate-500">Try adjusting your filters or search term.</p>
          <button type="button" onClick={resetFilters} className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 font-black text-white hover:bg-emerald-600">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsContent />
    </Suspense>
  );
}
