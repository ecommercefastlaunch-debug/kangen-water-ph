import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/presentation/route";
import { addDays, manilaToday } from "@/lib/validation";

const ENV_KEYS = ["RESEND_API_KEY", "BOOKING_TO_EMAIL", "BOOKING_FROM_EMAIL", "BOOKING_WEBHOOK_URL", "BOOKING_WEBHOOK_SECRET"];

let ipCounter = 0;

function body(overrides: Record<string, unknown> = {}) {
  return {
    fullName: "Maria Santos",
    mobile: "0917 123 4567",
    email: "maria@example.com",
    city: "Makati",
    preferredDate: addDays(manilaToday(), 3),
    preferredTime: "14:00",
    message: "Condo kitchen, pull-down faucet.",
    consent: true,
    website: "",
    startedAt: Date.now() - 30_000,
    ...overrides,
  };
}

function request(payload: unknown, headers: Record<string, string> = {}) {
  ipCounter += 1;
  return new Request("https://site.test/api/presentation", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "site.test",
      origin: "https://site.test",
      "x-forwarded-for": `203.0.113.${ipCounter}`,
      ...headers,
    },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
}

beforeEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/presentation — not configured", () => {
  it("refuses with 503 and never reports success", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(request(body()));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/presentation — webhook", () => {
  beforeEach(() => {
    process.env.BOOKING_WEBHOOK_URL = "https://hooks.example.com/k8";
    process.env.BOOKING_WEBHOOK_SECRET = "test-secret";
  });

  it("delivers a signed request and returns a reference only after a 2xx", async () => {
    const fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(request(body()));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.reference).toMatch(/^KWP-[0-9A-F]{8}$/);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://hooks.example.com/k8");
    const sent = JSON.parse(init.body as string);
    expect(sent.preferenceOnly).toBe(true);
    expect(sent.timeZone).toBe("Asia/Manila");
    expect(sent.request.mobile).toBe("+639171234567");
    const expected = createHmac("sha256", "test-secret").update(init.body as string).digest("hex");
    expect((init.headers as Record<string, string>)["X-Signature-SHA256"]).toBe(expected);
  });

  it("reports failure when the receiver does not accept the request", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(request(body()));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: "delivery_failed" });
  });

  it("reports failure when the receiver cannot be reached", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("fetch failed"))));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(request(body()));
    expect(res.status).toBe(502);
    // The log line must not contain the visitor's details.
    expect(JSON.stringify(log.mock.calls)).not.toMatch(/Maria|0917|example\.com/);
  });

  it("returns field errors for invalid input without calling the receiver", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(request(body({ email: "not-an-email", consent: false })));
    const json = await res.json();
    expect(res.status).toBe(422);
    expect(Object.keys(json.fieldErrors).sort()).toEqual(["consent", "email"]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects the honeypot, instant submissions, cross-origin posts and bad payloads", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect((await POST(request(body({ website: "spam" })))).status).toBe(400);
    expect((await POST(request(body({ startedAt: Date.now() })))).status).toBe(400);
    expect((await POST(request(body({ startedAt: undefined })))).status).toBe(400);
    expect((await POST(request(body(), { origin: "https://evil.test" }))).status).toBe(403);
    expect((await POST(request("{not json"))).status).toBe(400);
    expect((await POST(request(body(), { "content-type": "text/plain" }))).status).toBe(415);
    expect((await POST(request(body({ message: "x".repeat(9000) })))).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rate-limits repeated requests from one address", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("ok", { status: 200 })));
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      statuses.push((await POST(request(body(), { "x-forwarded-for": "198.51.100.7" }))).status);
    }
    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(statuses[5]).toBe(429);
  });
});

describe("POST /api/presentation — Resend", () => {
  it("sends an email with the visitor as reply-to", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.BOOKING_TO_EMAIL = "owner@example.com, team@example.com";
    process.env.BOOKING_FROM_EMAIL = "Kangen Water PH <bookings@example.com>";
    const fetchMock = vi.fn(async () => Response.json({ id: "email_1" }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(request(body()));
    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer re_test");
    const sent = JSON.parse(init.body as string);
    expect(sent.to).toEqual(["owner@example.com", "team@example.com"]);
    expect(sent.reply_to).toBe("maria@example.com");
    expect(sent.text).toContain("Asia/Manila");
    expect(sent.text).toContain("preference");
  });
});
