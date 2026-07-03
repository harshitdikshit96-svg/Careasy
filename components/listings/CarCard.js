"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPrice, getImages } from "@/lib/mockCars";
import ImageCarousel from "@/components/shared/ImageCarousel";
import Badge from "@/components/shared/Badge";

export default function CarCard({ car }) {
  const [compareIds, setCompareIds] = useState([]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setCompareIds(JSON.parse(localStorage.getItem("careasyCompare") ?? "[]"));
  }, []);

  const isSelected = compareIds.includes(car.id);

  const compareHref = useMemo(() => {
    const nextIds = isSelected ? compareIds : [...compareIds, car.id].slice(-3);
    return `/compare?cars=${nextIds.join(",")}`;
  }, [car.id, compareIds, isSelected]);

  function toggleCompare(e) {
    e.stopPropagation();
    e.preventDefault();
    const nextIds = isSelected
      ? compareIds.filter((id) => id !== car.id)
      : [...compareIds, car.id].slice(-3);
    setCompareIds(nextIds);
    localStorage.setItem("careasyCompare", JSON.stringify(nextIds));
  }

  const images = getImages(car);

  return (
    <>
      {/* ── MOBILE: full-width Swiggy-style list row ───────────── */}
      <Link
        href={`/car/${car.id}`}
        className="flex items-stretch overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm active:bg-slate-50 sm:hidden"
      >
        {/* Left: image thumbnail */}
        <div className="relative h-28 w-32 shrink-0 overflow-hidden bg-slate-100">
          <img
            src={images[0]}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover"
          />
          {/* Ownership chip over image */}
          {car.ownership && (
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">
              {car.ownership} Owner
            </span>
          )}
        </div>

        {/* Right: details */}
        <div className="flex flex-1 flex-col justify-between px-3 py-2.5">
          <div>
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <p className="truncate text-sm font-black leading-tight text-slate-950">
                  {car.brand} {car.model}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                  {car.year} • {car.location}
                </p>
              </div>
              {/* Compare toggle */}
              <button
                type="button"
                onClick={toggleCompare}
                className={`ml-1 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold transition ${
                  isSelected
                    ? "bg-emerald-500 text-white"
                    : "border border-slate-200 bg-white text-slate-500"
                }`}
              >
                {isSelected ? "✓" : "+"}
              </button>
            </div>

            <p className="mt-1.5 text-lg font-black leading-none tracking-tight text-slate-950">
              {formatPrice(car.price)}
            </p>
          </div>

          {/* Spec chips */}
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {car.mileage.toLocaleString("en-IN")} km
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {car.fuel}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {car.transmission}
            </span>
            {car.verified && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div className="flex shrink-0 items-center pr-3 text-slate-300">
          ›
        </div>
      </Link>

      {/* ── DESKTOP: existing vertical grid card ───────────────── */}
      <article
        className="group hidden flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 sm:flex"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-slate-100">
          <ImageCarousel
            images={images}
            alt={`${car.brand} ${car.model}`}
            playing={hovered}
          />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {car.verified && <Badge color="green">✓ Verified</Badge>}
            {car.newArrival && <Badge color="yellow">New</Badge>}
          </div>

          <button
            type="button"
            onClick={toggleCompare}
            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow transition-all ${
              isSelected
                ? "bg-emerald-500 text-white"
                : "bg-white/90 text-slate-700 backdrop-blur hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            {isSelected ? "✓ Added" : "+ Compare"}
          </button>

          {car.ownership && (
            <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
              {car.ownership} Owner
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
              {car.year} • {car.location}
            </p>
            <h3 className="mt-1 text-lg font-black leading-snug text-slate-950 transition-colors group-hover:text-emerald-700">
              {car.brand} {car.model}
            </h3>
            <p className="mt-1.5 text-2xl font-black tracking-tight text-slate-950">
              {formatPrice(car.price)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
              {car.mileage.toLocaleString("en-IN")} km
            </span>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">{car.fuel}</span>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">{car.transmission}</span>
            {car.finance && (
              <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-blue-700">
                Finance ✓
              </span>
            )}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2">
            <Link
              href={`/car/${car.id}`}
              className="rounded-xl bg-slate-950 px-3 py-2.5 text-center text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              View Details
            </Link>
            <Link
              href={compareHref}
              onClick={() => {
                if (!isSelected) toggleCompare({ preventDefault: () => {}, stopPropagation: () => {} });
              }}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-bold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-700"
            >
              Compare
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
