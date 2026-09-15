"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  dateBounds,
  formatManilaDate,
  LIMITS,
  TIME_SLOTS,
  timeSlotLabel,
  validateBooking,
  type BookingFields,
  type FieldErrors,
  type FieldName,
} from "@/lib/validation";

type Status = "idle" | "submitting" | "success";

const EMPTY: BookingFields = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
  consent: false,
};

const ORDER: FieldName[] = ["fullName", "mobile", "email", "city", "preferredDate", "preferredTime", "message", "consent"];

const LABELS: Record<FieldName, string> = {
  fullName: "Full Name",
  mobile: "Mobile Number",
  email: "Email Address",
  city: "City",
  preferredDate: "Preferred Date",
  preferredTime: "Preferred Time",
  message: "Message",
  consent: "Consent",
};

const SERVER_MESSAGES: Record<string, string> = {
  unavailable: "Online presentation requests aren't available right now. Nothing was sent.",
  too_fast: "That was quick — please check your details, then send again.",
  rate_limited: "Too many requests have come from this connection. Please wait a few minutes and try again.",
  delivery_failed: "We couldn't deliver your request just now, so nothing was sent. Please try again in a few minutes.",
  invalid: "Some details need attention. Please check the highlighted fields.",
};
const GENERIC_FAILURE = "We couldn't send your request, so nothing was received. Please try again.";

type Success = { reference: string; firstName: string; date: string; time: string };

/*
 * Date limits depend on "today" in Manila, so they're read in the browser —
 * a static page built yesterday must not carry yesterday's minimum. The
 * server snapshot is empty, so the attribute appears only after hydration.
 */
const subscribeNever = () => () => {};
const readBounds = () => {
  const { min, max } = dateBounds();
  return `${min}|${max}`;
};
const noBounds = () => "";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex gap-2 text-sm font-medium text-warn">
      <span aria-hidden="true">!</span>
      {message}
    </p>
  );
}

export function BookingForm({ available }: { available: boolean }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState<BookingFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Success | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const boundsKey = useSyncExternalStore(subscribeNever, readBounds, noBounds);
  const [minDate, maxDate] = boundsKey ? boundsKey.split("|") : [undefined, undefined];

  const startedAt = useRef<number>(0);
  const inFlight = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const update = <K extends FieldName>(name: K, value: BookingFields[K]) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name] || errors[name]) {
      const result = validateBooking(next);
      setErrors((prev) => ({ ...prev, [name]: result.ok ? undefined : result.errors[name] }));
    }
  };

  const blur = (name: FieldName) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const result = validateBooking(values);
    setErrors((prev) => ({ ...prev, [name]: result.ok ? undefined : result.errors[name] }));
  };

  const errorList = ORDER.filter((name) => errors[name]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || inFlight.current) return;
    setFormError(null);

    const check = validateBooking(values);
    if (!check.ok) {
      setErrors(check.errors);
      setTouched(Object.fromEntries(ORDER.map((n) => [n, true])));
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    inFlight.current = true;
    setStatus("submitting");

    try {
      const response = await fetch("/api/presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot, startedAt: startedAt.current }),
      });
      const data: { ok?: boolean; reference?: string; error?: string; fieldErrors?: FieldErrors } = await response
        .json()
        .catch(() => ({}));

      if (response.ok && data.ok && data.reference) {
        setSuccess({
          reference: data.reference,
          firstName: check.data.fullName.split(" ")[0],
          date: formatManilaDate(check.data.preferredDate),
          time: timeSlotLabel(check.data.preferredTime),
        });
        setStatus("success");
        return;
      }

      if (data.fieldErrors) setErrors(data.fieldErrors);
      setFormError(SERVER_MESSAGES[data.error ?? ""] ?? GENERIC_FAILURE);
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again — nothing was sent.");
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success" && success) {
    return (
      <div className="rounded-[var(--radius-lg)] bg-white p-8 sm:p-12" role="status">
        <p className="eyebrow text-glacier">Request received</p>
        <h3 ref={successRef} tabIndex={-1} className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
          Thank you, {success.firstName}.
        </h3>
        <p className="lede mt-6 text-ink-soft">
          Your presentation request has been sent. We&apos;ll contact you by mobile or email to arrange a time.
        </p>
        <dl className="mt-8 divide-y divide-line border-y border-line text-[0.9375rem]">
          <div className="grid grid-cols-[9rem_1fr] gap-4 py-3">
            <dt className="text-mute">Reference</dt>
            <dd className="font-medium tabular-nums text-ink">{success.reference}</dd>
          </div>
          <div className="grid grid-cols-[9rem_1fr] gap-4 py-3">
            <dt className="text-mute">You preferred</dt>
            <dd className="text-ink">
              {success.date}, {success.time} (Philippine time)
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-sm leading-relaxed text-mute">
          This is a preference, not a confirmed appointment. Nothing is booked until we&apos;ve agreed a time with you.
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";
  const describedBy = (name: FieldName, hint?: boolean) =>
    [hint ? id(`${name}-hint`) : null, errors[name] ? id(`${name}-error`) : null].filter(Boolean).join(" ") || undefined;
  const invalid = (name: FieldName) => (errors[name] ? true : undefined);

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="book-title"
      aria-busy={submitting}
      className="rounded-[var(--radius-lg)] bg-white p-6 sm:p-10"
    >
      {!available ? (
        <div id={id("unavailable")} className="mb-8 border-l-2 border-warn bg-[#fbf4ef] px-5 py-4 text-[0.9375rem] leading-relaxed text-ink">
          <p className="font-semibold">Online requests aren&apos;t open yet.</p>
          <p className="mt-1 text-ink-soft">
            This form isn&apos;t connected to an inbox yet, so it can&apos;t send anything. It will open once the site owner
            connects one.
          </p>
        </div>
      ) : null}

      <div
        ref={summaryRef}
        tabIndex={-1}
        role="alert"
        className={formError || errorList.length > 1 ? "mb-8 border-l-2 border-warn bg-[#fbf4ef] px-5 py-4 text-[0.9375rem]" : "sr-only"}
      >
        {formError ? <p className="font-semibold text-ink">{formError}</p> : null}
        {errorList.length > 1 ? (
          <>
            {!formError ? <p className="font-semibold text-ink">Please check {errorList.length} fields:</p> : null}
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
              {errorList.map((name) => (
                <li key={name}>
                  <a href={`#${id(name)}`} className="underline underline-offset-2">
                    {LABELS[name]}
                  </a>
                  : {errors[name]}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      <fieldset disabled={!available || submitting} aria-describedby={!available ? id("unavailable") : undefined} className="min-w-0">
        <legend className="sr-only">Presentation request</legend>
        <p className="mb-6 text-sm text-mute">All fields are required unless marked optional.</p>

        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor={id("fullName")} className="mb-2 block text-sm font-semibold text-ink">
              Full Name
            </label>
            <input
              id={id("fullName")}
              name="fullName"
              type="text"
              autoComplete="name"
              maxLength={LIMITS.fullName}
              required
              value={values.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              onBlur={() => blur("fullName")}
              aria-invalid={invalid("fullName")}
              aria-describedby={describedBy("fullName")}
              className="field"
            />
            <FieldError id={id("fullName-error")} message={errors.fullName} />
          </div>

          <div>
            <label htmlFor={id("mobile")} className="mb-2 block text-sm font-semibold text-ink">
              Mobile Number
            </label>
            <input
              id={id("mobile")}
              name="mobile"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={LIMITS.mobile}
              placeholder="0917 123 4567"
              required
              value={values.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              onBlur={() => blur("mobile")}
              aria-invalid={invalid("mobile")}
              aria-describedby={describedBy("mobile")}
              className="field"
            />
            <FieldError id={id("mobile-error")} message={errors.mobile} />
          </div>

          <div>
            <label htmlFor={id("email")} className="mb-2 block text-sm font-semibold text-ink">
              Email Address
            </label>
            <input
              id={id("email")}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              required
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={() => blur("email")}
              aria-invalid={invalid("email")}
              aria-describedby={describedBy("email")}
              className="field"
            />
            <FieldError id={id("email-error")} message={errors.email} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor={id("city")} className="mb-2 block text-sm font-semibold text-ink">
              City
            </label>
            <input
              id={id("city")}
              name="city"
              type="text"
              autoComplete="address-level2"
              maxLength={LIMITS.city}
              placeholder="e.g. Quezon City"
              required
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              onBlur={() => blur("city")}
              aria-invalid={invalid("city")}
              aria-describedby={describedBy("city")}
              className="field"
            />
            <FieldError id={id("city-error")} message={errors.city} />
          </div>

          <div>
            <label htmlFor={id("preferredDate")} className="mb-2 block text-sm font-semibold text-ink">
              Preferred Date
            </label>
            <input
              id={id("preferredDate")}
              name="preferredDate"
              type="date"
              min={minDate}
              max={maxDate}
              required
              value={values.preferredDate}
              onChange={(e) => update("preferredDate", e.target.value)}
              onBlur={() => blur("preferredDate")}
              aria-invalid={invalid("preferredDate")}
              aria-describedby={describedBy("preferredDate", true)}
              className="field"
            />
            <p id={id("preferredDate-hint")} className="mt-2 text-xs text-mute">
              From tomorrow, Philippine time.
            </p>
            <FieldError id={id("preferredDate-error")} message={errors.preferredDate} />
          </div>

          <div>
            <label htmlFor={id("preferredTime")} className="mb-2 block text-sm font-semibold text-ink">
              Preferred Time
            </label>
            <select
              id={id("preferredTime")}
              name="preferredTime"
              required
              value={values.preferredTime}
              onChange={(e) => update("preferredTime", e.target.value)}
              onBlur={() => blur("preferredTime")}
              aria-invalid={invalid("preferredTime")}
              aria-describedby={describedBy("preferredTime", true)}
              className="field"
            >
              <option value="">Select a time</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
            <p id={id("preferredTime-hint")} className="mt-2 text-xs text-mute">
              Asia/Manila. A preference, not a booking.
            </p>
            <FieldError id={id("preferredTime-error")} message={errors.preferredTime} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor={id("message")} className="mb-2 block text-sm font-semibold text-ink">
              Message <span className="font-normal text-mute">(optional)</span>
            </label>
            <textarea
              id={id("message")}
              name="message"
              rows={4}
              maxLength={LIMITS.message}
              placeholder="Anything we should know — your faucet type, questions, who will attend."
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              onBlur={() => blur("message")}
              aria-invalid={invalid("message")}
              aria-describedby={describedBy("message", true)}
              className="field"
            />
            <p id={id("message-hint")} className="mt-2 text-xs tabular-nums text-mute">
              {values.message.length} / {LIMITS.message}
            </p>
            <FieldError id={id("message-error")} message={errors.message} />
          </div>

          <div className="sm:col-span-2">
            <div className="flex gap-3">
              <input
                id={id("consent")}
                name="consent"
                type="checkbox"
                checked={values.consent}
                onChange={(e) => update("consent", e.target.checked)}
                onBlur={() => blur("consent")}
                aria-invalid={invalid("consent")}
                aria-describedby={describedBy("consent")}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-ink)]"
              />
              <label htmlFor={id("consent")} className="text-sm leading-relaxed text-ink-soft">
                I agree that my details may be used to contact me about this presentation request, as described in the{" "}
                <a href="/privacy" target="_blank" rel="noopener" className="font-medium text-ink underline underline-offset-2">
                  privacy notice
                </a>
                .
              </label>
            </div>
            <FieldError id={id("consent-error")} message={errors.consent} />
          </div>
        </div>

        {/* Honeypot: hidden from people and assistive technology. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={id("website")}>Leave this field empty</label>
          <input
            id={id("website")}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-ink px-8 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:bg-[#8b9197] sm:w-auto"
          >
            {submitting ? (
              <svg className="spinner h-4 w-4" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : null}
            SEND PRESENTATION REQUEST
          </button>
          <p className="text-sm text-mute" aria-live="polite">
            {submitting ? "Sending your request…" : ""}
          </p>
        </div>
      </fieldset>
    </form>
  );
}
