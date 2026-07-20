// Email Validation & Verification Helper for Misaq

const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "tempmail.net",
  "tempmail.org",
  "temp-mail.org",
  "tempmailo.com",
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.block",
  "mailinator.com",
  "mailinator.net",
  "yopmail.com",
  "yopmail.fr", "yopmail.net",
  "throwawaymail.com",
  "trashmail.com",
  "dispostable.com",
  "sharklasers.com",
  "getnada.com",
  "mohmal.com",
  "fakemailgenerator.com",
  "mytrashmail.com",
  "crazymailing.com",
  "maildrop.cc",
  "boun.cr",
  "tempail.com",
];

const KNOWN_INVALID_TLDS = ["invalid", "example", "test", "local", "localhost"];

export type EmailValidationResult = {
  valid: boolean;
  error?: string;
};

/**
 * Validates standard email format, single '@', valid domain with TLD,
 * absence of spaces & invalid characters, and blocks temporary/disposable providers.
 */
export function validateRealEmail(email: string): EmailValidationResult {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email address is required." };
  }

  // 1. Must not contain spaces
  if (/\s/.test(email)) {
    return { valid: false, error: "Email address must not contain spaces." };
  }

  // 2. Must contain exactly one '@'
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    return { valid: false, error: "Email must contain exactly one '@' symbol." };
  }

  const [localPart, domain] = email.split("@");

  // 3. Validate local part (username)
  if (!localPart || localPart.length < 1) {
    return { valid: false, error: "Missing username before '@'." };
  }
  const localPartRegex = /^[a-zA-Z0-9._%+-]+$/;
  if (!localPartRegex.test(localPart)) {
    return { valid: false, error: "Email username contains invalid characters." };
  }

  // 4. Validate domain part
  if (!domain || domain.length < 3) {
    return { valid: false, error: "Missing or invalid domain after '@'." };
  }

  // Must have at least one dot and a TLD of 2+ letters
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return { valid: false, error: "Email must contain a valid domain (e.g. gmail.com)." };
  }

  const domainLower = domain.toLowerCase();
  const domainParts = domainLower.split(".");
  const tld = domainParts[domainParts.length - 1];

  // Reject invalid TLDs or invalid keyword
  if (KNOWN_INVALID_TLDS.includes(tld) || domainLower === "invalid" || localPart === "example") {
    return { valid: false, error: "Email domain is not valid." };
  }

  // 5. Block Disposable / Temporary Email Providers
  const isTemporary =
    DISPOSABLE_DOMAINS.some(
      (d) => domainLower === d || domainLower.endsWith("." + d)
    ) ||
    domainLower.includes("tempmail") ||
    domainLower.includes("10minute") ||
    domainLower.includes("guerrillamail") ||
    domainLower.includes("mailinator") ||
    domainLower.includes("yopmail") ||
    domainLower.includes("throwaway") ||
    domainLower.includes("trashmail");

  if (isTemporary) {
    return { valid: false, error: "Please use a valid permanent email address." };
  }

  return { valid: true };
}

// Key for storing verified email status in localStorage
const VERIFIED_EMAILS_KEY = "misaq_verified_emails";
const PENDING_VERIFICATIONS_KEY = "misaq_pending_email_verifications";

// Pre-verified default demo emails
const DEFAULT_VERIFIED_EMAILS = [
  "ahmed.raza@gmail.com",
  "aisha.rahman@gmail.com",
  "hamza.siddiqui@gmail.com",
  "maryam.iqbal@gmail.com",
  "khadija.malik@gmail.com",
  "yusuf.khan@gmail.com",
  "bilal.ahmed@gmail.com",
  "admin@misaq.app",
  "super@misaq.app",
  "wali@gmail.com",
];

export function getVerifiedEmails(): string[] {
  if (typeof window === "undefined") return DEFAULT_VERIFIED_EMAILS;
  try {
    const saved = localStorage.getItem(VERIFIED_EMAILS_KEY);
    if (!saved) return DEFAULT_VERIFIED_EMAILS;
    return JSON.parse(saved);
  } catch {
    return DEFAULT_VERIFIED_EMAILS;
  }
}

export function isEmailVerified(email: string): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const verified = getVerifiedEmails();
  return verified.some((e) => e.toLowerCase() === cleanEmail);
}

export function markEmailAsVerified(email: string): void {
  if (typeof window === "undefined" || !email) return;
  const cleanEmail = email.trim().toLowerCase();
  const current = getVerifiedEmails();
  if (!current.some((e) => e.toLowerCase() === cleanEmail)) {
    const updated = [...current, cleanEmail];
    try {
      localStorage.setItem(VERIFIED_EMAILS_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  }
}

export type PendingVerification = {
  email: string;
  otp: string;
  createdAt: number;
  userPayload?: any;
};

export function getPendingVerifications(): Record<string, PendingVerification> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(PENDING_VERIFICATIONS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function setPendingVerification(email: string, payload?: any): string {
  const cleanEmail = email.trim().toLowerCase();
  // Fixed demo OTP fallback (or random 6-digit code)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const current = getPendingVerifications();
  current[cleanEmail] = {
    email: cleanEmail,
    otp,
    createdAt: Date.now(),
    userPayload: payload,
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PENDING_VERIFICATIONS_KEY, JSON.stringify(current));
    } catch {
      /* ignore */
    }
  }
  return otp;
}

export function verifyEmailOTP(email: string, inputOTP: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const current = getPendingVerifications();
  const pending = current[cleanEmail];

  // Allow test master OTP "123456" for demo convenience
  if (inputOTP === "123456" || (pending && pending.otp === inputOTP.trim())) {
    markEmailAsVerified(cleanEmail);
    delete current[cleanEmail];
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(PENDING_VERIFICATIONS_KEY, JSON.stringify(current));
      } catch {
        /* ignore */
      }
    }
    return true;
  }
  return false;
}
