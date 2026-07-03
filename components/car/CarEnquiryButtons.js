"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/trackEvent";

export default function CarEnquiryButtons({ carId, carName, compareHref }) {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      <Link
        href={compareHref}
        className="rounded-lg bg-slate-950 px-4 py-3 text-center font-black text-white hover:bg-emerald-600"
      >
        Compare
      </Link>
      <a
        href={`https://wa.me/+917275484697?text=Hi%20CarEasy%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(carName)}`}
        onClick={() => trackEvent("whatsapp", carId)}
        className="rounded-lg bg-emerald-500 px-4 py-3 text-center font-black text-white hover:bg-emerald-600"
      >
        WhatsApp
      </a>
      <a
        href="tel:+917275484697"
        onClick={() => trackEvent("call", carId)}
        className="rounded-lg border border-slate-200 px-4 py-3 text-center font-black text-slate-800 hover:border-emerald-500"
      >
        Call
      </a>
    </div>
  );
}
