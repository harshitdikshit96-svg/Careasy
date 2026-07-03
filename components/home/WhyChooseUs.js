const reasons = [
  "Verified Cars",
  "Best Price",
  "Easy Financing",
  "Quick Support",
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {reasons.map((reason, index) => (
          <div key={reason} className="rounded-lg border border-slate-200 p-5">
            <div className="mb-4 grid size-9 place-items-center rounded-lg bg-emerald-100 font-black text-emerald-700">
              {index + 1}
            </div>
            <h3 className="text-lg font-black text-slate-950">{reason}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A focused demo flow designed to make buyer decisions feel fast and
              confident.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
