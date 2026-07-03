"use client";

import { useState } from "react";

export default function AuthForm() {
  const [tab, setTab] = useState("login"); // "login" | "signup"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const username = form.get("username")?.trim();
    const password = form.get("password");

    const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/signup";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    // Hard navigation so the Navbar re-mounts and picks up the auth cookie
    window.location.href = data.role === "admin" ? "/admin/dashboard" : "/";
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-slate-200">
        {["login", "signup"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError(""); }}
            className={`py-4 text-sm font-black capitalize transition ${
              tab === t
                ? "border-b-2 border-emerald-500 text-emerald-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "login" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-700">
            Username
          </label>
          <input
            name="username"
            required
            placeholder={tab === "login" ? "Enter username" : "Choose a username"}
            autoComplete="username"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            placeholder={tab === "login" ? "Enter password" : "Create a password"}
            autoComplete={tab === "login" ? "current-password" : "new-password"}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-xl bg-emerald-500 py-3.5 font-black text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
        </button>

        {tab === "login" && (
          <p className="text-center text-xs text-slate-400">
            Admin credentials: <strong>admin / cars123</strong>
          </p>
        )}
      </form>
    </div>
  );
}
