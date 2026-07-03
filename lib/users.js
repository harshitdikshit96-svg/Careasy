/**
 * Simple in-memory user store for the prototype.
 * Resets on server restart — intentional for a demo.
 */

// username (lowercase) → { username, password, role }
const store = new Map([
  ["admin", { username: "admin", password: "cars123", role: "admin" }],
]);

export function findUser(username) {
  return store.get(username.toLowerCase()) ?? null;
}

export function createUser(username, password) {
  const key = username.toLowerCase();
  if (store.has(key)) return { error: "Username already taken." };
  if (username.length < 3) return { error: "Username must be at least 3 characters." };
  if (password.length < 4) return { error: "Password must be at least 4 characters." };
  store.set(key, { username, password, role: "user" });
  return { ok: true };
}
