"use client";

import { useEffect, useRef, useState } from "react";
import CarCard from "@/components/listings/CarCard";

const INITIAL = 6;
const BATCH = 3;

export default function TrendingCars({ cars }) {
  const [visible, setVisible] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visible < cars.length) {
          setLoading(true);
          // Simulate async fetch delay
          setTimeout(() => {
            setVisible((prev) => Math.min(prev + BATCH, cars.length));
            setLoading(false);
          }, 600);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visible, cars.length]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-emerald-600">
            <span>🆕</span> Fresh off the lot
          </p>
          <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950 sm:mt-2 sm:text-3xl lg:text-4xl">
            Recently Added
          </h2>
        </div>
        <p className="hidden text-sm font-bold text-slate-500 sm:block">
          {cars.length} cars
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {cars.slice(0, visible).map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {/* Skeleton loaders while fetching next batch */}
      {loading && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {Array.from({ length: BATCH }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {/* Mobile skeleton */}
              <div className="flex h-28 sm:hidden">
                <div className="h-full w-32 shrink-0 bg-slate-200" />
                <div className="flex-1 space-y-2 p-3">
                  <div className="h-3 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-200" />
                  <div className="h-5 w-24 rounded bg-slate-200" />
                </div>
              </div>
              {/* Desktop skeleton */}
              <div className="hidden sm:block">
                <div className="aspect-[16/10] bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-5 w-40 rounded bg-slate-200" />
                  <div className="h-7 w-28 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {visible < cars.length && (
        <div ref={sentinelRef} className="mt-8 flex justify-center">
          <span className="text-sm font-bold text-slate-400">Scroll for more</span>
        </div>
      )}

      {visible >= cars.length && cars.length > INITIAL && (
        <p className="mt-8 text-center text-sm font-bold text-slate-400">
          You've seen all {cars.length} trending cars
        </p>
      )}
    </section>
  );
}
