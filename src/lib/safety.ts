export interface SafetyEvent {
  id: string;
  userId: string;
  userName: string;
  userRole: string; // e.g. "Groom" | "Bride"
  matchId: string;
  chatId: string;
  time: string;
  blockedMessage: string;
  reasonCategory: string;
  reviewStatus: "Pending" | "Reviewed" | "Cleared";
  severityLevel: "Low" | "Medium" | "High";
  internalNotes?: string;
}

// Validation rules using keywords
export function validateMessageContent(text: string): {
  isValid: boolean;
  category?: string;
  severity: "Low" | "Medium" | "High";
} {
  const lower = text.toLowerCase().trim();

  // Simple lists of offensive/inappropriate keywords or matching patterns
  const rules = [
    {
      category: "Inappropriate / Explicit Content",
      severity: "High" as const,
      keywords: ["sexy", "babe", "sweetheart", "kiss me", "hug me", "date me", "flirt", "darling", "hot boy", "hot girl", "sexual", "vulgar"]
    },
    {
      category: "Threat / Harassment",
      severity: "High" as const,
      keywords: ["kill you", "slap you", "threaten", "hurt you", "destroy you", "hate you", "shut up", "stupid", "idiot", "moron", "jerk"]
    },
    {
      category: "Abusive / Profane Language",
      severity: "Medium" as const,
      keywords: ["bastard", "donkey", "badtameez", "kaminey", "ullu", "bakwas", "bloody", "nonsense", "rubbish"]
    }
  ];

  for (const rule of rules) {
    for (const kw of rule.keywords) {
      // Word boundary regex or simple substring containment
      const regex = new RegExp(`\\b${kw}\\b`, "i");
      if (regex.test(lower)) {
        return {
          isValid: false,
          category: rule.category,
          severity: rule.severity
        };
      }
    }
  }

  return { isValid: true, severity: "Low" };
}

const STORAGE_KEY = "misaq_safety_events";

// Get all safety events from local storage
export function getSafetyEvents(): SafetyEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error reading safety events", e);
    return [];
  }
}

// Save all safety events to local storage
export function saveSafetyEvents(events: SafetyEvent[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error("Error writing safety events", e);
  }
}

// Add a safety event log
export function addSafetyEvent(event: Omit<SafetyEvent, "id">): SafetyEvent {
  const events = getSafetyEvents();
  const newEvent: SafetyEvent = {
    ...event,
    id: `se_${Date.now()}`
  };
  events.push(newEvent);
  saveSafetyEvents(events);
  
  // Notify listeners
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("misaq_safety_events_updated"));
  }
  return newEvent;
}

// Update safety event details (notes, reviewStatus)
export function updateSafetyEvent(id: string, updates: Partial<SafetyEvent>) {
  const events = getSafetyEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...updates };
    saveSafetyEvents(events);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("misaq_safety_events_updated"));
    }
  }
}

// Delete safety event or clear it
export function clearSafetyEvent(id: string) {
  const events = getSafetyEvents();
  const next = events.filter((e) => e.id !== id);
  saveSafetyEvents(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("misaq_safety_events_updated"));
  }
}

// Count how many times this specific user triggered safety events
export function getUserSafetyEventCount(userId: string): number {
  const events = getSafetyEvents();
  return events.filter((e) => e.userId === userId).length;
}
