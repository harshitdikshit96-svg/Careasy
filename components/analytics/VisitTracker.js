"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    // Get or create a persistent session UUID
    let sessionId = localStorage.getItem("ce_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("ce_session_id", sessionId);
    }

    // Dedup: only send once per browser tab session
    const alreadyTracked = sessionStorage.getItem("ce_visit_tracked");
    if (alreadyTracked) return;
    sessionStorage.setItem("ce_visit_tracked", "1");

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visit", sessionId }),
    }).catch(() => {}); // fire-and-forget
  }, []);

  return null;
}
