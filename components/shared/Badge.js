export default function Badge({
  children,
  color = "green",
  className = "",
}) {
  const variants = {
    green:
      "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20",

    dark:
      "bg-slate-950 text-white shadow-lg",

    white:
      "bg-white/90 backdrop-blur text-slate-900",

    red:
      "bg-red-500 text-white",

    yellow:
      "bg-amber-500 text-white",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition-all ${variants[color]} ${className}`}
    >
      {children}
    </span>
  );
}