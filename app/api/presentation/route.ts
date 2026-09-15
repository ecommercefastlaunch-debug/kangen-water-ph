import { randomUUID } from "node:crypto";
import { bookingDelivery, deliverBooking, DeliveryError } from "@/lib/booking";
import { validateBooking } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8_000;
/** A person needs a few seconds to fill seven fields; scripts usually don't wait. */
const MIN_FILL_MS = 2_500;
const MAX_FILL_MS = 1000 * 60 * 60 * 12;

/**
 * Best-effort, per-instance limit: 5 requests per 10 minutes per client IP.
 * Serverless instances don't share memory, so this slows abuse rather than
 * guaranteeing a global cap. Nothing here is persisted or logged.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function isRateLimited(key: string, now: number): boolean {
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5_000) {
    for (const [k, times] of recent) if (times.every((t) => now - t >= WINDOW_MS)) recent.delete(k);
  }
  return hits.length > MAX_PER_WINDOW;
}

type ErrorCode =
  | "unavailable"
  | "forbidden"
  | "unsupported"
  | "too_large"
  | "bad_request"
  | "rejected"
  | "too_fast"
  | "rate_limited"
  | "invalid"
  | "delivery_failed";

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function fail(status: number, error: ErrorCode, extra: Record<string, unknown> = {}) {
  return reply(status, { ok: false, error, ...extra });
}

export async function POST(request: Request) {
  if (!bookingDelivery()) return fail(503, "unavailable");

  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return fail(403, "forbidden");
    } catch {
      return fail(403, "forbidden");
    }
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail(415, "unsupported");
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return fail(413, "too_large");
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return fail(413, "too_large");

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail(400, "bad_request");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "bad_request");
  }

  // Honeypot: a field people never see. Filled means automated — refused,
  // never answered with a pretend success.
  if (typeof body.website === "string" && body.website.trim() !== "") return fail(400, "rejected");

  const now = Date.now();
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : NaN;
  const elapsed = now - startedAt;
  if (!Number.isFinite(elapsed) || elapsed > MAX_FILL_MS) return fail(400, "rejected");
  if (elapsed < MIN_FILL_MS) return fail(400, "too_fast");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip, now)) return fail(429, "rate_limited");

  const result = validateBooking(body, new Date(now));
  if (!result.ok) return fail(422, "invalid", { fieldErrors: result.errors });

  const reference = `KWP-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;

  try {
    await deliverBooking({ reference, receivedAt: new Date(now), booking: result.data });
  } catch (error) {
    // Log the failure class only — never the visitor's details.
    const code = error instanceof DeliveryError ? error.message : error instanceof Error ? error.name : "unknown";
    console.error(`[presentation] delivery failed: ${code}`);
    return fail(502, "delivery_failed");
  }

  return reply(200, { ok: true, reference });
}
