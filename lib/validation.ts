/**
 * Booking-form rules, shared by the browser (for usability) and the API
 * route (for security). The server never trusts the client's result — it
 * runs validateBooking() again on the raw request body.
 *
 * All scheduling is in Asia/Manila. The preferred date and time are a
 * visitor's preference, not a reservation.
 */

export const TIME_ZONE = "Asia/Manila";

/** Requests can name a date from tomorrow up to this many days ahead. */
export const BOOKING_WINDOW_DAYS = 90;

export const LIMITS = {
  fullName: 80,
  mobile: 20,
  email: 254,
  city: 80,
  message: 1000,
} as const;

export const TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number]["value"];

export type BookingFields = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  consent: boolean;
};

export type FieldName = keyof BookingFields;
export type FieldErrors = Partial<Record<FieldName, string>>;

export type CleanBooking = Omit<BookingFields, "consent" | "preferredTime"> & {
  preferredTime: TimeSlot;
  /** +63 followed by ten digits. */
  mobileE164: string;
};

export type ValidationResult =
  | { ok: true; data: CleanBooking }
  | { ok: false; errors: FieldErrors };

/** Today's date in Manila as YYYY-MM-DD. */
export function manilaToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export function dateBounds(now: Date = new Date()): { min: string; max: string } {
  const today = manilaToday(now);
  return { min: addDays(today, 1), max: addDays(today, BOOKING_WINDOW_DAYS) };
}

function isRealIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/** "Saturday, 3 October 2026" — the date read in Manila. */
export function formatManilaDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  // 04:00 UTC is noon in Manila (UTC+8, no daylight saving), safely mid-day.
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d, 4)));
}

export function timeSlotLabel(value: string): string {
  return TIME_SLOTS.find((slot) => slot.value === value)?.label ?? value;
}

/**
 * Accepts 0917 123 4567, +63 917 123 4567, 63-917-123-4567 or 9171234567.
 * Returns +639171234567, or null when it is not a Philippine mobile number.
 */
export function normalizePhMobile(raw: string): string | null {
  const compact = raw.replace(/[\s\-().]/g, "");
  const match = compact.match(/^(?:\+?63|0)?(9\d{9})$/);
  return match ? `+63${match[1]}` : null;
}

const EMAIL_RE = /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[A-Za-z]{2,}$/;
// Control characters, including CR/LF, are never valid in a single-line field.
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const CONTROL_EXCEPT_NEWLINE = /[\u0000-\u0009\u000B-\u001F\u007F]/g;

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function singleLine(value: unknown): string {
  return text(value).replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim();
}

export function validateBooking(raw: unknown, now: Date = new Date()): ValidationResult {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: FieldErrors = {};

  const fullName = singleLine(input.fullName);
  if (!fullName) errors.fullName = "Enter your full name.";
  else if (fullName.length < 2 || !/\p{L}/u.test(fullName)) errors.fullName = "Enter your full name as you'd like us to address you.";
  else if (fullName.length > LIMITS.fullName) errors.fullName = `Keep your name under ${LIMITS.fullName} characters.`;

  const mobile = singleLine(input.mobile);
  const mobileE164 = mobile.length <= LIMITS.mobile ? normalizePhMobile(mobile) : null;
  if (!mobile) errors.mobile = "Enter your mobile number.";
  else if (!mobileE164) errors.mobile = "Enter a Philippine mobile number, for example 0917 123 4567.";

  const email = singleLine(input.email).toLowerCase();
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.email = "Enter an email address like name@example.com.";

  const city = singleLine(input.city);
  if (!city) errors.city = "Enter your city or municipality.";
  else if (city.length < 2) errors.city = "Enter the full name of your city or municipality.";
  else if (city.length > LIMITS.city) errors.city = `Keep the city under ${LIMITS.city} characters.`;

  const preferredDate = singleLine(input.preferredDate);
  const { min, max } = dateBounds(now);
  if (!preferredDate) errors.preferredDate = "Choose a preferred date.";
  else if (!isRealIsoDate(preferredDate)) errors.preferredDate = "Choose a date from the calendar.";
  else if (preferredDate < min) errors.preferredDate = "Choose a date from tomorrow onwards (Philippine time).";
  else if (preferredDate > max) errors.preferredDate = `Choose a date within the next ${BOOKING_WINDOW_DAYS} days.`;

  const preferredTime = singleLine(input.preferredTime);
  const slot = TIME_SLOTS.find((s) => s.value === preferredTime);
  if (!preferredTime) errors.preferredTime = "Choose a preferred time.";
  else if (!slot) errors.preferredTime = "Choose one of the listed times.";

  const message = text(input.message).replace(CONTROL_EXCEPT_NEWLINE, " ").replace(/\n{3,}/g, "\n\n").trim();
  if (message.length > LIMITS.message) errors.message = `Keep your message under ${LIMITS.message} characters.`;

  if (input.consent !== true) errors.consent = "Please confirm we may contact you about this request.";

  if (Object.keys(errors).length > 0 || !mobileE164 || !slot) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: { fullName, mobile, mobileE164, email, city, preferredDate, preferredTime: slot.value, message },
  };
}
