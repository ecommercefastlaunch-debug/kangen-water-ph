import { createHmac } from "node:crypto";
import { formatManilaDate, timeSlotLabel, TIME_ZONE, type CleanBooking } from "./validation";

/**
 * Where presentation requests go. Server-only: reads secret environment
 * variables and must never be imported by a Client Component.
 *
 * Exactly one receiver is used, chosen from what is configured:
 *   1. Email through Resend — RESEND_API_KEY, BOOKING_TO_EMAIL, BOOKING_FROM_EMAIL
 *   2. An HTTPS webhook — BOOKING_WEBHOOK_URL (+ optional BOOKING_WEBHOOK_SECRET)
 *
 * With neither configured, the form is shown as unavailable and the API
 * refuses requests. A request only counts as sent when the receiver
 * answers with a 2xx status.
 */

export type DeliveryMethod = "resend" | "webhook";

export class DeliveryError extends Error {
  constructor(code: string) {
    super(code);
    this.name = "DeliveryError";
  }
}

export function bookingDelivery(env: NodeJS.ProcessEnv = process.env): DeliveryMethod | null {
  if (env.RESEND_API_KEY && env.BOOKING_TO_EMAIL && env.BOOKING_FROM_EMAIL) return "resend";
  if (env.BOOKING_WEBHOOK_URL && isHttpsUrl(env.BOOKING_WEBHOOK_URL)) return "webhook";
  return null;
}

export function isBookingConfigured(): boolean {
  return bookingDelivery() !== null;
}

/** HTTPS only — plain HTTP is accepted for a receiver on this machine, for local testing. */
function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol === "https:") return true;
    return url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
  } catch {
    return false;
  }
}

export type BookingEnvelope = {
  reference: string;
  receivedAt: Date;
  booking: CleanBooking;
};

export function bookingSummary({ reference, receivedAt, booking }: BookingEnvelope): string {
  const received = new Intl.DateTimeFormat("en-PH", {
    timeZone: TIME_ZONE,
    dateStyle: "full",
    timeStyle: "short",
  }).format(receivedAt);

  return [
    `New LeveLuk K8 presentation request — ${reference}`,
    "",
    `Name:            ${booking.fullName}`,
    `Mobile:          ${booking.mobileE164} (entered as ${booking.mobile})`,
    `Email:           ${booking.email}`,
    `City:            ${booking.city}`,
    `Preferred date:  ${formatManilaDate(booking.preferredDate)}`,
    `Preferred time:  ${timeSlotLabel(booking.preferredTime)} (Asia/Manila)`,
    "",
    "Message:",
    booking.message || "(none)",
    "",
    `Received: ${received} (Asia/Manila)`,
    "The date and time are the visitor's preference. Nothing has been confirmed to them;",
    "their confirmation screen says you will contact them to arrange a time.",
  ].join("\n");
}

/** Generous enough for a cold-starting receiver such as Google Apps Script. */
const TIMEOUT_MS = 15_000;

async function sendWithResend(envelope: BookingEnvelope, env: NodeJS.ProcessEnv): Promise<void> {
  const to = (env.BOOKING_TO_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `presentation-${envelope.reference}`,
    },
    body: JSON.stringify({
      from: env.BOOKING_FROM_EMAIL,
      to,
      reply_to: envelope.booking.email,
      subject: `K8 presentation request — ${envelope.booking.fullName}, ${envelope.booking.city} (${envelope.reference})`,
      text: bookingSummary(envelope),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) throw new DeliveryError(`resend_http_${response.status}`);
}

async function sendToWebhook(envelope: BookingEnvelope, env: NodeJS.ProcessEnv): Promise<void> {
  const { booking } = envelope;
  const body = JSON.stringify({
    type: "presentation_request",
    reference: envelope.reference,
    receivedAt: envelope.receivedAt.toISOString(),
    timeZone: TIME_ZONE,
    preferenceOnly: true,
    request: {
      fullName: booking.fullName,
      mobile: booking.mobileE164,
      email: booking.email,
      city: booking.city,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      message: booking.message,
    },
    summary: bookingSummary(envelope),
  });

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (env.BOOKING_WEBHOOK_SECRET) {
    const signature = createHmac("sha256", env.BOOKING_WEBHOOK_SECRET).update(body).digest("hex");
    headers["X-Signature-SHA256"] = signature;
  }

  const response = await fetch(env.BOOKING_WEBHOOK_URL as string, {
    method: "POST",
    headers,
    body,
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) throw new DeliveryError(`webhook_http_${response.status}`);

  // Some receivers (Google Apps Script among them) answer 200 even when they
  // fail: with an HTML error page, or with {"ok": false}. Neither is a delivery.
  const type = response.headers.get("content-type") ?? "";
  if (type.includes("text/html")) throw new DeliveryError("webhook_html_response");
  if (type.includes("application/json")) {
    const reply: unknown = await response.json().catch(() => null);
    if (reply && typeof reply === "object" && (reply as { ok?: unknown }).ok === false) {
      throw new DeliveryError("webhook_rejected");
    }
  }
}

/** Resolves only once the receiver has accepted the request. */
export async function deliverBooking(
  envelope: BookingEnvelope,
  env: NodeJS.ProcessEnv = process.env,
): Promise<DeliveryMethod> {
  const method = bookingDelivery(env);
  if (method === "resend") await sendWithResend(envelope, env);
  else if (method === "webhook") await sendToWebhook(envelope, env);
  else throw new DeliveryError("not_configured");
  return method;
}
