"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  // Auth state
  const [authUser, setAuthUser] = useState(null); // null = loading, false = guest, object = logged in
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Search state
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Fetch current user on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setAuthUser(data.user ?? false))
      .catch(() => setAuthUser(false));
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function handler(e) {
      if (!userMenuRef.current?.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close search on outside click
  useEffect(() => {
    function handler(e) {
      if (!searchRef.current?.contains(e.target)) {
        setSearchOpen(false);
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleSearch(q) {
    setQuery(q);
    if (!q.trim()) { setSuggestions([]); return; }
    try {
      const res = await fetch(`/api/cars?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch {
      setSuggestions([]);
    }
  }

  function submitSearch(e) {
    e?.preventDefault();
    if (!query.trim()) return;
    router.push(`/listings?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setSuggestions([]);
    setQuery("");
  }

  function pickSuggestion(car) {
    router.push(`/car/${car.id}`);
    setSearchOpen(false);
    setSuggestions([]);
    setQuery("");
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthUser(false);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const isAdmin = authUser?.role === "admin";

  const navLinks = [
    { href: "/listings", label: "Listings" },
    { href: "/compare", label: "Compare" },
    ...(isAdmin ? [{ href: "/admin/dashboard", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-black text-slate-950">
          <span className="grid size-9 place-items-center rounded-lg bg-emerald-500 text-white">C</span>
          CarEasy
        </Link>

        {/* Nav links — hidden on very small mobile, visible from sm: */}
        <div className="hidden items-center gap-4 text-sm font-semibold text-slate-700 sm:flex sm:gap-5 lg:gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:text-emerald-600 ${l.label === "Admin" ? "font-black text-emerald-600 hover:text-emerald-700" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Search — expands inline */}
        <div ref={searchRef} className="relative flex flex-1 justify-end md:max-w-xs">
          {searchOpen ? (
            <form onSubmit={submitSearch} className="relative w-full">
              <input
                autoFocus
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search brand, model, city…"
                className="w-full rounded-xl border border-emerald-400 bg-white py-2 pl-4 pr-10 text-sm outline-none ring-2 ring-emerald-100"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600" aria-label="Search">
                🔍
              </button>
              {suggestions.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  {suggestions.map((car) => (
                    <button
                      key={car.id}
                      type="button"
                      onClick={() => pickSuggestion(car)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50"
                    >
                      <span className="font-bold text-slate-950">{car.brand} {car.model}</span>
                      <span className="ml-auto text-xs text-slate-400">{car.location}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
              aria-label="Open search"
            >
              🔍 <span className="hidden sm:inline">Search</span>
            </button>
          )}
        </div>

        {/* Right side: auth + browse + hamburger */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Auth area */}
          {authUser ? (
            /* Logged-in user avatar + dropdown */
            <div ref={userMenuRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:border-emerald-400 hover:text-emerald-600"
              >
                <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-xs font-black text-white">
                  {authUser.username[0].toUpperCase()}
                </span>
                <span className="hidden max-w-[80px] truncate sm:inline">{authUser.username}</span>
                <span className="text-xs text-slate-400">{userMenuOpen ? "▲" : "▼"}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                  {/* Profile header */}
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="font-black text-slate-950">{authUser.username}</p>
                    <p className="text-xs font-semibold capitalize text-slate-400">{authUser.role}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
                    >
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/listings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    🚗 Browse Cars
                  </Link>
                  <div className="border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                    >
                      ↩ Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest: Sign In link */
            authUser !== null && (
              <Link
                href="/login"
                className="hidden rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:border-emerald-400 hover:text-emerald-600 sm:block"
              >
                Sign In
              </Link>
            )
          )}

          <Link
            href="/listings"
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-600"
          >
            Browse
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 sm:hidden"
            aria-label="Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-bold hover:bg-slate-50 hover:text-emerald-600 ${l.label === "Admin" ? "text-emerald-600" : "text-slate-700"}`}
              >
                {l.label}
              </Link>
            ))}
            {authUser ? (
              <>
                <div className="border-t border-slate-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  {authUser.username} ({authUser.role})
                </div>
                <button
                  type="button"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
