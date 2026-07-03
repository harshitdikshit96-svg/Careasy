"use client";

import { trackEvent } from "@/lib/trackEvent";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/+917275484697?text=Hi%20CarEasy%2C%20I%20am%20interested%20in%20a%20used%20car"
      onClick={() => trackEvent("whatsapp")}
      className="fixed bottom-5 right-5 z-50 rounded-full bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-600"
    >
      WhatsApp
    </a>
  );
}
