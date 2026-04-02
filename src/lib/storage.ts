// lib/storage.ts

export const TOKEN_KEYS = {
  access: "nexlearn_access_token",
  refresh: "nexlearn_refresh_token",
  mobile: "nexlearn_mobile",
};

/**
 * PRODUCTION SET-COOKIE HELPER
 * Ensures SameSite=Lax for standard session security.
 */
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * PRODUCTION DELETE-COOKIE HELPER
 * Correctly targets the root path to ensure simultaneous cleanup of session state.
 */
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export const saveTokens = (access: string, refresh: string) => {
  if (typeof window === "undefined") return;

  // ─── CSR Sync ───────────────────────────────────────────────────────────
  localStorage.setItem(TOKEN_KEYS.access, access);
  localStorage.setItem(TOKEN_KEYS.refresh, refresh);

  // ─── SSR Sync (for Middleware) ──────────────────────────────────────────
  setCookie(TOKEN_KEYS.access, access);
  setCookie(TOKEN_KEYS.refresh, refresh);
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;

  // ─── CSR Cleanup ────────────────────────────────────────────────────────
  localStorage.removeItem(TOKEN_KEYS.access);
  localStorage.removeItem(TOKEN_KEYS.refresh);
  localStorage.removeItem(TOKEN_KEYS.mobile);

  // ─── SSR Cleanup ────────────────────────────────────────────────────────
  deleteCookie(TOKEN_KEYS.access);
  deleteCookie(TOKEN_KEYS.refresh);
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEYS.access);
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEYS.refresh);
};