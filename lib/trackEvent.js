/** Fire-and-forget analytics event tracker. Safe to call from client components. */
export function trackEvent(type, carId = null) {
  try {
    let sessionId = localStorage.getItem("ce_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("ce_session_id", sessionId);
    }
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, sessionId, carId }),
    }).catch(() => {});
  } catch {
    // localStorage not available (SSR guard)
  }
}
