// Mock admin auth flag stored in sessionStorage. UI-only — no real security.
const KEY = "misaq.admin.session";
const ROLE_KEY = "misaq.admin.role";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function isSuperAdmin(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(ROLE_KEY) === "super";
  } catch {
    return false;
  }
}

export function setAdminAuth(role: "super" | "normal" = "super"): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, "1");
    window.sessionStorage.setItem(ROLE_KEY, role);
  } catch {
    /* ignore */
  }
}

export function clearAdminAuth(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
    window.sessionStorage.removeItem(ROLE_KEY);
  } catch {
    /* ignore */
  }
}
