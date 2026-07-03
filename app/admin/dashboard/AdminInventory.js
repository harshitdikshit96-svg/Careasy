"use client";

import { useMemo, useRef, useState } from "react";

const EMPTY_FORM = {
  brand: "",
  model: "",
  variant: "",
  year: "",
  price: "",
  fuel: "Petrol",
  transmission: "Manual",
  mileage: "",
  location: "",
  category: "Sedan",
  ownership: "1st",
  description: "",
  // images: string[] — relative paths or external URLs
  images: [],
  featured: false,
  newArrival: false,
  trending: false,
  verified: false,
  finance: false,
};

function getFirstImg(car) {
  return Array.isArray(car.image) ? car.image[0] : car.image;
}

function formatPriceLocal(v) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(v);
}

export default function AdminInventory({ cars: initialCars }) {
  const [cars, setCars] = useState(initialCars);
  const [searchQ, setSearchQ] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | car object (edit)
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef(null);

  const filteredCars = useMemo(() => {
    if (!searchQ.trim()) return cars;
    const q = searchQ.toLowerCase();
    return cars.filter((c) =>
      `${c.brand} ${c.model} ${c.location} ${c.fuel} ${c.transmission} ${c.year}`
        .toLowerCase()
        .includes(q),
    );
  }, [cars, searchQ]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setError("");
    setUrlInput("");
    setModal("add");
  }

  function openEdit(car) {
    const existingImages = Array.isArray(car.image) ? car.image : car.image ? [car.image] : [];
    setForm({
      brand: car.brand,
      model: car.model,
      variant: car.variant ?? "",
      year: car.year,
      price: car.price,
      fuel: car.fuel,
      transmission: car.transmission,
      mileage: car.mileage,
      location: car.location,
      category: car.category ?? "Sedan",
      ownership: car.ownership ?? "1st",
      description: car.description ?? "",
      images: existingImages,
      featured: car.featured ?? false,
      newArrival: car.newArrival ?? false,
      trending: car.trending ?? false,
      verified: car.verified ?? false,
      finance: car.finance ?? false,
    });
    setError("");
    setUrlInput("");
    setModal(car);
  }

  function closeModal() {
    setModal(null);
    setForm(EMPTY_FORM);
    setError("");
    setUrlInput("");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleFileChange(e) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { urls } = await res.json();
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function addUrlImage() {
    const url = urlInput.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setUrlInput("");
  }

  function removeImage(idx) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const imageList = form.images.length > 0
      ? form.images
      : ["https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1400&auto=format&fit=crop"];

    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage),
      image: imageList,
      features: [],
    };

    try {
      if (modal === "add") {
        const res = await fetch("/api/cars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to add car");
        }
        const newCar = await res.json();
        setCars((prev) => [newCar, ...prev]);
      } else {
        const res = await fetch(`/api/cars/${modal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to update car");
        }
        const updated = await res.json();
        setCars((prev) => prev.map((c) => (c.id === modal.id ? updated : c)));
      }
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      const res = await fetch(`/api/cars/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setCars((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch {
      // keep modal open on error
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-black text-slate-950">
              All Cars ({filteredCars.length}{searchQ ? ` of ${cars.length}` : ""})
            </h2>
            <button
              type="button"
              onClick={openAdd}
              className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-black text-white hover:bg-emerald-600"
            >
              + Add Car
            </button>
          </div>
          <div className="relative mt-3">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search by brand, model, location, fuel…"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            {searchQ && (
              <button
                type="button"
                onClick={() => setSearchQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {filteredCars.length === 0 && (
          <div className="px-5 py-10 text-center text-slate-500">
            <p className="font-bold">No cars match "{searchQ}"</p>
            <button type="button" onClick={() => setSearchQ("")} className="mt-2 text-sm text-emerald-600 hover:underline">
              Clear search
            </button>
          </div>
        )}

        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="grid gap-4 border-b border-slate-100 p-4 last:border-0 sm:grid-cols-[80px_1fr_120px_auto] sm:items-center"
          >
            <img
              src={getFirstImg(car)}
              alt={car.model}
              className="aspect-video w-20 rounded-md object-cover"
            />
            <div>
              <h3 className="font-black text-slate-950">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm font-semibold text-slate-500">
                {car.location} • {car.year} • {car.mileage?.toLocaleString("en-IN")} km
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {car.verified && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    Verified
                  </span>
                )}
                {car.finance && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                    Finance
                  </span>
                )}
                {car.trending && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                    Trending
                  </span>
                )}
              </div>
            </div>
            <p className="font-black text-slate-950">{formatPriceLocal(car.price)}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(car)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(car.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
            <h2 className="mb-5 text-2xl font-black text-slate-950">
              {modal === "add" ? "Add Car" : "Edit Car"}
            </h2>
            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </p>
            )}
            <form onSubmit={handleSave} className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input name="brand" placeholder="Brand *" required value={form.brand} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                <input name="model" placeholder="Model *" required value={form.model} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="year" type="number" placeholder="Year *" required value={form.year} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                <input name="price" type="number" placeholder="Price (₹) *" required value={form.price} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select name="fuel" value={form.fuel} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                  <option>CNG</option>
                </select>
                <select name="transmission" value={form.transmission} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
                  <option>Manual</option>
                  <option>Automatic</option>
                  <option>AMT</option>
                  <option>CVT</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="mileage" type="number" placeholder="Mileage (km) *" required value={form.mileage} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                <input name="location" placeholder="Location *" required value={form.location} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select name="category" value={form.category} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
                  <option>SUV</option>
                  <option>Sedan</option>
                  <option>Hatchback</option>
                  <option>Luxury</option>
                  <option>Budget</option>
                  <option>Electric</option>
                </select>
                <select name="ownership" value={form.ownership} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
                  <option>1st</option>
                  <option>2nd</option>
                  <option>3rd</option>
                </select>
              </div>
              {/* ── Image section ── */}
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  Images ({form.images.length})
                </p>

                {/* Preview grid */}
                {form.images.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {form.images.map((url, idx) => (
                      <div key={idx} className="group relative h-16 w-20 overflow-hidden rounded-lg border border-slate-200">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute left-0 top-0 bg-emerald-500 px-1 py-0.5 text-[8px] font-black text-white">MAIN</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[9px] text-white opacity-0 transition group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload from device */}
                <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-sm font-bold transition ${uploading ? "border-emerald-300 bg-emerald-50 text-emerald-600" : "border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-600"}`}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  {uploading ? "Uploading…" : "📷 Upload photos"}
                </label>

                {/* Or paste URL */}
                <div className="mt-2 flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrlImage())}
                    placeholder="Or paste image URL…"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addUrlImage}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
              </div>
              <textarea name="description" placeholder="Description" rows={3} value={form.description} onChange={handleChange} className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
              <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-700">
                {[["featured", "Featured"], ["newArrival", "New Arrival"], ["trending", "Trending"], ["verified", "Verified"], ["finance", "Finance"]].map(([name, label]) => (
                  <label key={name} className="flex items-center gap-2">
                    <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="accent-emerald-500" />
                    {label}
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-3">
                <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-emerald-500 py-3 font-black text-white hover:bg-emerald-600 disabled:opacity-60">
                  {saving ? "Saving…" : modal === "add" ? "Add Car" : "Save Changes"}
                </button>
                <button type="button" onClick={closeModal} className="rounded-lg border border-slate-200 px-5 py-3 font-black text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-black text-slate-950">Delete listing?</h2>
            <p className="mt-2 text-slate-600">This will permanently remove the car from the database.</p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={handleDelete} disabled={saving} className="flex-1 rounded-lg bg-red-500 py-3 font-black text-white hover:bg-red-600 disabled:opacity-60">
                {saving ? "Deleting…" : "Delete"}
              </button>
              <button type="button" onClick={() => setDeleteId(null)} className="rounded-lg border border-slate-200 px-5 py-3 font-black text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
