"use client";

import { useEffect } from "react";

export default function ViewTracker({ carId }) {
  useEffect(() => {
    if (!carId) return;

    const sessionId = localStorage.getItem("ce_session_id") || crypto.randomUUID();
    localStorage.setItem("ce_session_id", sessionId);

    // Dedup per car per tab session
    const key = `ce_view_${carId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "view", carId, sessionId }),
    }).catch(() => {});
  }, [carId]);

  return null;
}
