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
    window.sessionStorage.removeItem(READ_ONLY_KEY);
  } catch {
    /* ignore */
  }
}

const READ_ONLY_KEY = "misaq.admin.read_only_user_id";

export function setReadOnlySession(userId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(READ_ONLY_KEY, userId);
  } catch {
    /* ignore */
  }
}

export function clearReadOnlySession(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(READ_ONLY_KEY);
  } catch {
    /* ignore */
  }
}

export function getReadOnlyUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(READ_ONLY_KEY);
  } catch {
    return null;
  }
}

export function isReadOnlySession(): boolean {
  return !!getReadOnlyUserId();
}

