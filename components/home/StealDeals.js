"use client";

import { useState } from "react";
import { stealDeals } from "@/lib/stealDeals";

function ImageCarouselSimple({ images }) {
  const [idx, setIdx] = useState(0);
  const imgs = Array.isArray(images) ? images : [images];
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-200">
      <img src={imgs[idx]} alt="" className="h-full w-full object-cover transition-opacity duration-300" />
      {imgs.length > 1 && (
        <>
          <button onClick={() => setIdx((i) => (i - 1 + imgs.length) % imgs.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur text-sm">‹</button>
          <button onClick={() => setIdx((i) => (i + 1) % imgs.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur text-sm">›</button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imgs.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function formatPrice(v) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(v);
}

function DealModal({ deal, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image carousel */}
        <div className="relative">
          <ImageCarouselSimple images={deal.image} />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur"
          >
            ✕
          </button>
          <span className="absolute left-4 top-4 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white">
            🔥 Steal Deal
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                {deal.year} · {deal.fuel} · {deal.transmission}
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">{deal.title}</h2>
              <p className="text-sm font-semibold text-slate-400">{deal.subtitle}</p>
            </div>
            <p className="shrink-0 text-2xl font-black text-slate-950">{deal.priceLabel}</p>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">{deal.description}</p>

          {/* Highlights */}
          <div className="mt-4 flex flex-wrap gap-2">
            {deal.highlights.map((h) => (
              <span key={h} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                ✓ {h}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href={`https://wa.me/+917275484697?text=${encodeURIComponent(deal.whatsappText)}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 font-black text-white hover:bg-emerald-600"
          >
            WhatsApp to Enquire
          </a>
        </div>
      </div>
    </div>
  );
}

export default function StealDeals() {
  const [activeDeal, setActiveDeal] = useState(null);

  if (!stealDeals.length) return null;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-rose-500">
              <span>🔥</span> Limited picks
            </p>
            <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              Steal Deals
            </h2>
            <p className="mt-1 text-sm text-slate-500">Hand-picked cars we genuinely think you shouldn't miss.</p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stealDeals.map((deal) => (
            <button
              key={deal.id}
              type="button"
              onClick={() => setActiveDeal(deal)}
              className="group relative overflow-hidden rounded-2xl bg-slate-950 text-left transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/20"
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={Array.isArray(deal.image) ? deal.image[0] : deal.image}
                  alt={deal.title}
                  className="h-full w-full object-cover opacity-40 transition duration-500 group-hover:opacity-50 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              </div>

              {/* Content */}
              <div className="relative p-5">
                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-black text-white">
                    🔥 Steal Deal
                  </span>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                    {deal.badge}
                  </span>
                </div>

                {/* Title + price */}
                <div className="mt-20 sm:mt-24 lg:mt-28">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {deal.year} · {deal.fuel}
                  </p>
                  <h3 className="mt-1 text-xl font-black text-white">{deal.title}</h3>
                  <p className="text-sm font-semibold text-white/60">{deal.subtitle}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-2xl font-black text-white">{deal.priceLabel}</p>
                    <span className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition group-hover:bg-emerald-500">
                      Quick View →
                    </span>
                  </div>

                  {/* Top highlights row */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {deal.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick view modal */}
      {activeDeal && <DealModal deal={activeDeal} onClose={() => setActiveDeal(null)} />}
    </>
  );
}
