import Link from "next/link";

const categories = [
  { label: "All Cars", value: "", icon: "🚗" },
  { label: "SUV", value: "SUV", icon: "🛻" },
  { label: "Sedan", value: "Sedan", icon: "🚙" },
  { label: "Hatchback", value: "Hatchback", icon: "🚘" },
  { label: "Luxury", value: "Luxury", icon: "💎" },
  { label: "Budget", value: "Budget", icon: "💰" },
  { label: "Automatic", value: "Automatic", icon: "⚙️" },
  { label: "Diesel", value: "Diesel", icon: "🛢️" },
  { label: "Petrol", value: "Petrol", icon: "⛽" },
];

export default function Categories() {
  return (
    <section className="border-b border-slate-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.value ? `/listings?category=${cat.value}` : "/listings"}
              className="group flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <span className="text-base leading-none">{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
