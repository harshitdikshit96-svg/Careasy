"use client";

const BRANDS = [
  "Hyundai", "Maruti Suzuki", "Honda", "Kia", "Toyota", "Tata",
  "Mahindra", "Volkswagen", "MG", "Renault", "BMW", "Ford",
];

const FILTERS = [
  { key: "brand", label: "Brand", options: BRANDS },
  { key: "fuel", label: "Fuel", options: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"] },
  { key: "transmission", label: "Gearbox", options: ["Manual", "Automatic", "AMT", "CVT"] },
  { key: "ownership", label: "Owner", options: ["1st", "2nd", "3rd"] },
  { key: "budget", label: "Budget", options: ["Under ₹2L", "₹2L–₹5L", "₹5L–₹10L", "₹10L–₹20L", "Above ₹20L"] },
  { key: "kms", label: "KMs", options: ["Under 30K", "30K–60K", "60K–90K", "Above 90K"] },
  { key: "year", label: "Year", options: ["2023+", "2020–2022", "2017–2019", "Before 2017"] },
];

export default function FilterBar({ filters, onChange, onReset, totalResults }) {
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-950">Filters</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-black text-white">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 sm:text-sm">{totalResults} cars</span>
          {activeCount > 0 && (
            <button type="button" onClick={onReset} className="text-xs font-bold text-emerald-600 hover:underline sm:text-sm">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter selects: horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-3 pb-3 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-4 sm:pb-4 lg:grid lg:grid-cols-7 lg:overflow-visible">
        {FILTERS.map((f) => (
          <div key={f.key} className="relative shrink-0 lg:shrink">
            <select
              value={filters[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              className={`w-full appearance-none rounded-full border py-1.5 pl-3 pr-2 text-xs font-semibold outline-none transition focus:ring-2 focus:ring-emerald-100 lg:rounded-xl ${
                filters[f.key]
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <option value="">{f.label}</option>
              {f.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] ${filters[f.key] ? "text-emerald-600" : "text-slate-400"}`}>
              ▼
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
