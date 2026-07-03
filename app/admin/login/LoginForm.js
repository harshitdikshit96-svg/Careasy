"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });

    if (response.ok) {
      router.push("/admin/dashboard");
      router.refresh();
      return;
    }

    setError("Use admin / cars123 for this prototype.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <input
        name="username"
        placeholder="Username"
        className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
      />
      {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
      <button
        type="submit"
        className="rounded-lg bg-emerald-500 px-5 py-3 font-black text-white hover:bg-emerald-600"
      >
        Login
      </button>
    </form>
  );
}
