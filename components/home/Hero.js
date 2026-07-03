"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: "main",
    bg: "bg-[radial-gradient(circle_at_top_left,#123b3d_0,#020617_42%,#050816_100%)]",
    eyebrow: ["150-point checked", "Finance ready", "7-day support"],
    heading: "Find Your\nPerfect Used Car",
    sub: "Browse verified cars, compare options, and connect with a seller in seconds.",
    ctas: [
      { label: "Browse Cars", href: "/listings", variant: "white" },
      { label: "WhatsApp Us", href: "https://wa.me/+917275484697", variant: "outline", external: true },
    ],
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1400&auto=format&fit=crop",
    stats: [{ value: "150+", label: "Cars" }, { value: "24h", label: "Support" }, { value: "100%", label: "Verified" }],
    showSearch: true,
  },
  {
    id: "testdrive",
    bg: "bg-[radial-gradient(circle_at_bottom_right,#064e3b_0,#022c22_40%,#011a14_100%)]",
    eyebrow: ["No commitment", "Expert inspection", "Any location"],
    badge: "Starting at ₹500",
    heading: "Test Drive\nat Home",
    sub: "Our trained expert drives the car to your doorstep. Experience it before you decide.",
    ctas: [
      { label: "Book on WhatsApp", href: "https://wa.me/+917275484697?text=Hi%20CarEasy%2C%20I%20want%20to%20book%20a%20home%20test%20drive", variant: "emerald", external: true },
      { label: "See Listings", href: "/listings", variant: "outline" },
    ],
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1400&auto=format&fit=crop",
    stats: [{ value: "₹500", label: "Booking" }, { value: "2hr", label: "Arrival" }, { value: "Safe", label: "Inspected" }],
    showSearch: false,
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 2500);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = slides[current];

  return (
    <section
      className={`${slide.bg} relative overflow-hidden transition-colors duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image — visible on mobile as a subtle overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.15] lg:hidden"
        style={{ backgroundImage: `url(${slide.image})` }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Layout: single column on mobile, two columns on desktop */}
        <div className="grid items-center gap-6 py-7 sm:py-10 lg:min-h-[520px] lg:grid-cols-2 lg:gap-10 lg:py-14">

          {/* ── Text column ── */}
          <div className="max-w-xl">
            {/* Eyebrow chips */}
            <div className="mb-3 flex flex-wrap gap-1.5 sm:mb-4 sm:gap-2">
              {slide.eyebrow.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-200 sm:text-xs">
                  {tag}
                </span>
              ))}
            </div>

            {/* Badge (slide 2) — consistent height placeholder on slide 1 */}
            <div className="mb-2 h-7 sm:mb-3 sm:h-8">
              {slide.badge && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white shadow-lg shadow-emerald-900/40 sm:px-3.5 sm:text-sm">
                  🏠 {slide.badge}
                </div>
              )}
            </div>

            {/* Heading */}
            <h1
              className="text-[2rem] font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl"
              style={{ whiteSpace: "pre-line" }}
            >
              {slide.heading}
            </h1>

            {/* Subtitle */}
            <p className="mt-2.5 max-w-md text-sm leading-6 text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
              {slide.sub}
            </p>

            {/* Search bar — reserve fixed height to prevent CLS */}
            <div className="mt-4 h-14 sm:h-16">
              {slide.showSearch && (
                <form
                  className="flex h-full gap-1.5 rounded-xl bg-white p-1.5 shadow-2xl shadow-black/20"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = e.currentTarget.q.value.trim();
                    window.location.href = q ? `/listings?q=${encodeURIComponent(q)}` : "/listings";
                  }}
                >
                  <input
                    name="q"
                    placeholder="Search Creta, Baleno, SUV…"
                    className="flex-1 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 sm:px-4"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-emerald-500 px-4 text-sm font-black text-white hover:bg-emerald-600 sm:px-5"
                  >
                    Search
                  </button>
                </form>
              )}
            </div>

            {/* CTA buttons */}
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
              {slide.ctas.map((cta) => {
                const cls = {
                  white: "rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-slate-100",
                  outline: "rounded-xl border border-white/20 px-4 py-2.5 text-sm font-black text-white hover:border-emerald-300 hover:text-emerald-200",
                  emerald: "rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-black text-white hover:bg-emerald-400",
                }[cta.variant];
                return cta.external
                  ? <a key={cta.label} href={cta.href} className={cls}>{cta.label}</a>
                  : <Link key={cta.label} href={cta.href} className={cls}>{cta.label}</Link>;
              })}
            </div>
          </div>

          {/* ── Image column — desktop only ── */}
          <div className="relative hidden h-[320px] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 lg:block lg:h-[400px] xl:h-[440px]">
            <img
              key={slide.id}
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2 rounded-xl bg-white/90 p-3 text-center shadow-lg backdrop-blur">
              {slide.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-black text-slate-950">{s.value}</p>
                  <p className="text-xs font-bold text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip — mobile only */}
        <div className="grid grid-cols-3 gap-2 pb-5 lg:hidden">
          {slide.stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-white/10 py-2 text-center backdrop-blur">
              <p className="text-base font-black text-white sm:text-lg">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-300 sm:text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Slide dots */}
      <div className="relative flex justify-center gap-2 pb-3">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-emerald-400" : "w-2 bg-white/30 hover:bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
