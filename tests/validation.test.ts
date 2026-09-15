import { describe, expect, it } from "vitest";
import { dateBounds, formatManilaDate, manilaToday, normalizePhMobile, validateBooking } from "@/lib/validation";

// 20:00 UTC on 15 Sep is already 04:00 on 16 Sep in Manila.
const NOW = new Date("2026-09-15T20:00:00Z");

const valid = {
  fullName: "Maria Santos",
  mobile: "0917 123 4567",
  email: "Maria@Example.com",
  city: "Quezon City",
  preferredDate: "2026-09-20",
  preferredTime: "10:00",
  message: "",
  consent: true,
};

describe("Manila dates", () => {
  it("reads today in Asia/Manila, not UTC", () => {
    expect(manilaToday(NOW)).toBe("2026-09-16");
    expect(dateBounds(NOW)).toEqual({ min: "2026-09-17", max: "2026-12-15" });
  });

  it("formats a date as it reads in Manila", () => {
    const label = formatManilaDate("2026-09-20");
    expect(label).toMatch(/^Sunday/);
    expect(label).toMatch(/September/);
    expect(label).toMatch(/\b20\b/);
    expect(label).toMatch(/2026/);
  });
});

describe("normalizePhMobile", () => {
  it.each(["09171234567", "0917 123 4567", "+63 917 123 4567", "63-917-123-4567", "9171234567"])(
    "accepts %s",
    (input) => expect(normalizePhMobile(input)).toBe("+639171234567"),
  );

  it.each(["(02) 8123 4567", "0917123456", "+1 415 555 0100", "0817 123 4567", "abc"])("rejects %s", (input) =>
    expect(normalizePhMobile(input)).toBeNull(),
  );
});

describe("validateBooking", () => {
  it("accepts and normalises a valid request", () => {
    const result = validateBooking(valid, NOW);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.mobileE164).toBe("+639171234567");
      expect(result.data.email).toBe("maria@example.com");
      expect(result.data.preferredTime).toBe("10:00");
    }
  });

  it("requires every field except the message", () => {
    const result = validateBooking({}, NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ["city", "consent", "email", "fullName", "mobile", "preferredDate", "preferredTime"].sort(),
      );
    }
  });

  it("rejects today and past dates in Manila time, and dates beyond the window", () => {
    for (const preferredDate of ["2026-09-16", "2026-09-01", "2026-12-16", "2026-02-30", "20-09-2026"]) {
      const result = validateBooking({ ...valid, preferredDate }, NOW);
      expect(result.ok, preferredDate).toBe(false);
    }
    expect(validateBooking({ ...valid, preferredDate: "2026-09-17" }, NOW).ok).toBe(true);
  });

  it("only accepts listed time slots", () => {
    expect(validateBooking({ ...valid, preferredTime: "03:00" }, NOW).ok).toBe(false);
    expect(validateBooking({ ...valid, preferredTime: "18:00" }, NOW).ok).toBe(true);
  });

  it("requires consent to be exactly true", () => {
    expect(validateBooking({ ...valid, consent: "true" }, NOW).ok).toBe(false);
  });

  it("strips control characters and header-injection attempts from single-line fields", () => {
    const result = validateBooking({ ...valid, fullName: "Maria\r\nBcc: x@y.z" }, NOW);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.fullName).toBe("Maria Bcc: x@y.z");
  });

  it("enforces length limits", () => {
    expect(validateBooking({ ...valid, message: "a".repeat(1001) }, NOW).ok).toBe(false);
    expect(validateBooking({ ...valid, fullName: "a".repeat(81) }, NOW).ok).toBe(false);
    expect(validateBooking({ ...valid, email: `${"a".repeat(250)}@x.com` }, NOW).ok).toBe(false);
  });

  it("ignores non-string input safely", () => {
    const result = validateBooking({ ...valid, fullName: { $gt: "" }, city: ["Manila"] }, NOW);
    expect(result.ok).toBe(false);
  });
});
