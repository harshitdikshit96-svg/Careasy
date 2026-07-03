import Link from "next/link";
import ImageCarousel from "@/components/shared/ImageCarousel";
import ViewTracker from "@/components/analytics/ViewTracker";
import CarEnquiryButtons from "@/components/car/CarEnquiryButtons";
import { prisma } from "@/lib/db";
import { serializeCar } from "@/lib/carSerializer";

function formatPrice(v) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(v);
}

export default async function CarDetailsPage({ params }) {
  const { id } = await params;
  const dbCar = await prisma.car.findUnique({ where: { id } });

  if (!dbCar) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-2xl font-black">
        Car not found.
      </div>
    );
  }

  const car = serializeCar(dbCar);
  const images = Array.isArray(car.image) ? car.image : [car.image];

  const specs = [
    { label: "Mileage", value: `${car.mileage?.toLocaleString("en-IN")} km` },
    { label: "Fuel", value: car.fuel },
    { label: "Gearbox", value: car.transmission },
    { label: "Owner", value: `${car.ownership} Owner` },
    { label: "Category", value: car.category },
    ...(car.finance ? [{ label: "Finance", value: "Available ✓" }] : []),
  ];

  return (
    <>
      <ViewTracker carId={car.id} />

      {/* ── MOBILE layout ───────────────────────────────────── */}
      <div className="lg:hidden">
        {/* Full-bleed image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
          <ImageCarousel images={images} alt={`${car.brand} ${car.model}`} playing />
          {/* Back button overlay */}
          <Link
            href="/listings"
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
          >
            ←
          </Link>
        </div>

        {/* Content card — overlaps image by 16px */}
        <div className="-mt-4 rounded-t-3xl bg-white px-5 pb-36 pt-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {car.verified && (
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">✓ Verified</span>
            )}
            {car.finance && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Finance Available</span>
            )}
            {car.ownership && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{car.ownership} Owner</span>
            )}
          </div>

          {/* Title */}
          <p className="mt-3 text-xs font-black uppercase tracking-widest text-emerald-600">
            {car.year} • {car.location}
          </p>
          <h1 className="mt-1 text-2xl font-black leading-tight text-slate-950">
            {car.brand} {car.model}
            {car.variant ? <span className="text-lg font-semibold text-slate-500"> {car.variant}</span> : null}
          </h1>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {formatPrice(car.price)}
          </p>

          {/* Spec chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {specs.map((s) => (
              <span key={s.label} className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                {s.value}
              </span>
            ))}
          </div>

          {/* Description */}
          {car.description && (
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{car.description}</p>
          )}

          {/* Features */}
          {car.features?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {car.features.map((f) => (
                <span key={f} className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{f}</span>
              ))}
            </div>
          )}
        </div>

        {/* Sticky bottom CTA bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2">
            <Link
              href={`/compare?cars=${car.id}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-sm font-black text-slate-700"
              title="Compare"
            >
              ⚖
            </Link>
            <a
              href={`https://wa.me/+917275484697?text=Hi%20CarEasy%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(`${car.brand} ${car.model} ${car.year}`)}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-black text-white"
            >
              WhatsApp
            </a>
            <a
              href="tel:+917275484697"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-black text-slate-800"
            >
              Call
            </a>
          </div>
        </div>
      </div>

      {/* ── DESKTOP layout ──────────────────────────────────── */}
      <div className="mx-auto hidden max-w-7xl px-4 py-10 sm:px-6 lg:block lg:px-8">
        <Link href="/listings" className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-emerald-600">
          ← Back to listings
        </Link>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Image gallery */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200">
            <ImageCarousel images={images} alt={`${car.brand} ${car.model}`} playing />
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {car.verified && (
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">✓ Verified</span>
              )}
              {car.finance && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Finance Available</span>
              )}
              {car.ownership && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{car.ownership} Owner</span>
              )}
            </div>
            <p className="mt-4 text-sm font-black uppercase tracking-widest text-emerald-600">
              {car.year} • {car.location}
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-slate-950">
              {car.brand} {car.model}
            </h1>
            {car.variant && <p className="mt-1 text-lg font-semibold text-slate-500">{car.variant}</p>}
            <p className="mt-3 text-4xl font-black text-slate-950">{formatPrice(car.price)}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {specs.map((s) => (
                <div key={s.label} className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{s.label}</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-800">{s.value}</p>
                </div>
              ))}
            </div>

            {car.description && (
              <p className="mt-5 leading-7 text-slate-600">{car.description}</p>
            )}

            {car.features?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <span key={f} className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{f}</span>
                ))}
              </div>
            )}

            <CarEnquiryButtons
              carId={car.id}
              carName={`${car.brand} ${car.model} ${car.year}`}
              compareHref={`/compare?cars=${car.id}`}
            />
          </section>
        </div>
      </div>
    </>
  );
}
