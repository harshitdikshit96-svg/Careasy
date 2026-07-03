"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice, getFirstImage } from "@/lib/mockCars";
import { trackEvent } from "@/lib/trackEvent";

// [label, getDisplay, direction, getNumeric]
const rows = [
  ["Price", (car) => formatPrice(car.price), "lower", (car) => car.price],
  ["Year", (car) => car.year, "higher", (car) => car.year],
  ["Mileage", (car) => `${car.mileage.toLocaleString("en-IN")} km`, "lower", (car) => car.mileage],
  ["Fuel", (car) => car.fuel, null, null],
  ["Transmission", (car) => car.transmission, null, null],
  ["Ownership", (car) => (car.ownership ? `${car.ownership} Owner` : "—"), null, null],
  ["Location", (car) => car.location, null, null],
  ["Finance", (car) => (car.finance ? "✓ Available" : "Direct purchase"), null, null],
];

function getWinners(selectedCars, direction, numeric) {
  if (!direction || !numeric || selectedCars.length < 2) return [];
  const values = selectedCars.map(numeric);
  const best = direction === "lower" ? Math.min(...values) : Math.max(...values);
  return selectedCars.map((_, i) => values[i] === best);
}

export default function CompareBuilder({ cars, initialIds }) {
  const [selectedIds, setSelectedIds] = useState(initialIds ?? []);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Load from localStorage on mount if no initialIds
  useEffect(() => {
    if (initialIds && initialIds.length > 0) return;
    const stored = JSON.parse(localStorage.getItem("careasyCompare") ?? "[]");
    if (stored.length > 0) setSelectedIds(stored.slice(0, 3));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("careasyCompare", JSON.stringify(selectedIds));
  }, [selectedIds]);

  // Close suggestions on outside click
  useEffect(() => {
    function handler(e) {
      if (!searchRef.current?.contains(e.target)) setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedCars = useMemo(
    () => cars.filter((c) => selectedIds.includes(c.id)).slice(0, 3),
    [cars, selectedIds],
  );

  const trendingCars = useMemo(() => cars.filter((c) => c.trending), [cars]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return cars
      .filter(
        (c) =>
          !selectedIds.includes(c.id) &&
          (`${c.brand} ${c.model}`.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q)),
      )
      .slice(0, 8);
  }, [query, cars, selectedIds]);

  function addCar(id) {
    if (selectedIds.includes(id) || selectedIds.length >= 3) return;
    setSelectedIds((prev) => [...prev, id]);
    setQuery("");
    setShowSuggestions(false);
  }

  function removeCar(id) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  // Scoring for Best Pick badge
  const scores = useMemo(() => {
    const s = selectedCars.map(() => 0);
    rows.forEach(([, , direction, numeric]) => {
      if (!direction || !numeric) return;
      const winners = getWinners(selectedCars, direction, numeric);
      winners.forEach((w, i) => { if (w) s[i]++; });
    });
    return s;
  }, [selectedCars]);

  const full = selectedCars.length >= 3;

  return (
    <div className="space-y-8">
      {/* ── Search to add ─────────────────────────────────────── */}
      <section ref={searchRef} className="relative">
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">
          Search &amp; add a car
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
            <input
              type="text"
              value={query}
              disabled={full}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={full ? "Remove a car to add another" : "Search by brand, model, or city…"}
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-10 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
            {suggestions.map((car) => (
              <li key={car.id}>
                <button
                  type="button"
                  onClick={() => addCar(car.id)}
                  className="grid w-full grid-cols-[56px_1fr_auto] items-center gap-3 px-4 py-2.5 text-left hover:bg-emerald-50"
                >
                  <img
                    src={getFirstImage(car)}
                    alt={car.model}
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                  />
                  <span>
                    <span className="block font-black text-slate-950">
                      {car.brand} {car.model}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {car.year} • {formatPrice(car.price)} • {car.location}
                    </span>
                  </span>
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white">
                    Add
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>



      {/* ── Trending cars slider ──────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            🔥 Trending — add to compare
          </p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
          {trendingCars.map((car) => {
            const already = selectedIds.includes(car.id);
            return (
              <div
                key={car.id}
                className="w-52 shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={getFirstImage(car)}
                    alt={car.model}
                    className="h-full w-full object-cover"
                  />
                  {already && (
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/80">
                      <span className="text-2xl font-black text-white">✓</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate font-black text-slate-950 text-sm leading-tight">
                    {car.brand} {car.model}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-emerald-600">
                    {formatPrice(car.price)}
                  </p>
                  <button
                    type="button"
                    disabled={already || full}
                    onClick={() => addCar(car.id)}
                    className={`mt-2 w-full rounded-xl py-1.5 text-xs font-black transition ${
                      already
                        ? "bg-emerald-100 text-emerald-700 cursor-default"
                        : full
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-950 text-white hover:bg-emerald-600"
                    }`}
                  >
                    {already ? "Added ✓" : "Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
            {/* ── Selected cars tray ────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            Selected ({selectedCars.length}/3)
          </p>
          {selectedCars.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((slot) => {
            const car = selectedCars[slot];
            return car ? (
              <div
                key={car.id}
                className="relative overflow-hidden rounded-2xl border border-emerald-300 bg-emerald-50 p-3 shadow-sm"
              >
                <img
                  src={getFirstImage(car)}
                  alt={car.model}
                  className="aspect-[16/9] w-full rounded-xl object-cover"
                />
                <p className="mt-2 font-black leading-tight text-slate-950 text-sm">
                  {car.brand} {car.model}
                </p>
                <p className="text-xs font-bold text-emerald-600">{formatPrice(car.price)}</p>
                <button
                  type="button"
                  onClick={() => removeCar(car.id)}
                  className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-white/90 text-sm font-black text-slate-500 shadow hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                key={`empty-${slot}`}
                className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50"
              >
                <span className="text-xs font-bold text-slate-400">
                  {slot === 0 ? "Search above" : `Slot ${slot + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Comparison table ─────────────────────────────────── */}
      {selectedCars.length < 2 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-2xl font-black text-slate-950">Select at least 2 cars</p>
          <p className="mx-auto mt-2 max-w-sm text-slate-500">
            Search above or add from the trending slider. The table updates instantly.
          </p>
          <Link
            href="/listings"
            className="mt-5 inline-block rounded-xl bg-slate-950 px-6 py-3 font-black text-white hover:bg-emerald-600"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Car header row */}
          <div
            className="grid min-w-[600px] border-b border-slate-200 bg-slate-50"
            style={{ gridTemplateColumns: `160px repeat(${selectedCars.length}, minmax(0,1fr))` }}
          >
            <div className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">
              Metric
            </div>
            {selectedCars.map((car, idx) => (
              <div key={car.id} className="relative border-l border-slate-200 p-4">
                {selectedCars.length > 1 && scores[idx] === Math.max(...scores) && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-black text-white">
                    ⭐ Best Pick
                  </span>
                )}
                <img
                  src={getFirstImage(car)}
                  alt={car.model}
                  className="aspect-[16/9] w-full rounded-xl object-cover"
                />
                <h3 className="mt-3 font-black leading-tight text-slate-950">
                  {car.brand} {car.model}
                </h3>
                <p className="mt-0.5 text-sm font-bold text-emerald-600">{formatPrice(car.price)}</p>
                <button
                  type="button"
                  onClick={() => removeCar(car.id)}
                  className="mt-2 text-xs font-bold text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {rows.map(([label, getValue, direction, numeric]) => {
            const winners = getWinners(selectedCars, direction, numeric);
            return (
              <div
                key={label}
                className="grid min-w-[600px] border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                style={{ gridTemplateColumns: `160px repeat(${selectedCars.length}, minmax(0,1fr))` }}
              >
                <div className="flex items-center bg-slate-50/60 px-4 py-3.5 text-sm font-black text-slate-500">
                  {label}
                </div>
                {selectedCars.map((car, idx) => (
                  <div
                    key={car.id}
                    className={`flex items-center border-l border-slate-100 px-4 py-3.5 text-sm font-bold ${
                      winners[idx] ? "bg-emerald-50 text-emerald-700" : "text-slate-800"
                    }`}
                  >
                    {getValue(car)}
                    {winners[idx] && <span className="ml-2 text-emerald-500">✓</span>}
                  </div>
                ))}
              </div>
            );
          })}

          {/* WhatsApp CTA row */}
          <div
            className="grid min-w-[600px] border-t border-slate-200 bg-slate-50"
            style={{ gridTemplateColumns: `160px repeat(${selectedCars.length}, minmax(0,1fr))` }}
          >
            <div className="p-4" />
            {selectedCars.map((car) => (
              <div key={car.id} className="border-l border-slate-200 p-4">
                <a
                  href={`https://wa.me/+917275484697?text=Hi%20CarEasy%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(`${car.brand} ${car.model} ${car.year}`)}`}
                  onClick={() => trackEvent("whatsapp", car.id)}
                  className="block rounded-xl bg-emerald-500 py-2.5 text-center text-sm font-black text-white hover:bg-emerald-600"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
