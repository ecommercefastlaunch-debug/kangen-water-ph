# Kangen Water PH — LeveLuk K8

A single-product presentation site for the Enagic LeveLuk K8. One story,
one product, one call to action in the header: **BOOK A PRESENTATION**.
No shop, no cart, no accounts.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · deployed on Vercel.

## Structure

```
app/
  layout.tsx            fonts, metadata (canonical from the real production domain)
  page.tsx              the page, section by section
  privacy/page.tsx      privacy notice — describes the configured delivery method
  api/presentation/     POST endpoint for presentation requests
  robots.ts, sitemap.ts, icon.svg, apple-icon.png, opengraph-image.jpg
components/             one file per section; FiveWaters, BookingForm and
                        RevealRoot are the only Client Components
lib/
  content.ts            every product fact and line of copy
  validation.ts         booking rules, shared by browser and server (Asia/Manila)
  booking.ts            delivery to the receiver (server only)
  site.ts               site name and origin
docs/content-sources.md source for every product claim, and known conflicts
tests/                  Vitest: validation and the API route
```

## Develop

```bash
npm install
npm run dev
```

Checks — type check, lint, tests and production build:

```bash
npm run check
```

## Presentation requests

The form posts to `/api/presentation`, which validates the request again on
the server (lengths, Philippine mobile format, Manila dates, allowed times,
consent), applies a honeypot, a minimum fill time, a same-origin check and a
best-effort rate limit, then hands it to **one** receiver. The visitor sees
success only after the receiver answers 2xx. Nothing is stored by the site,
and form contents are never logged.

Configure one receiver in Vercel → Project → Settings → Environment
Variables (see `.env.example`):

| Option | Variables |
| --- | --- |
| Email via [Resend](https://resend.com) | `RESEND_API_KEY`, `BOOKING_TO_EMAIL`, `BOOKING_FROM_EMAIL` |
| HTTPS webhook (Apps Script, Make, Zapier, CRM) | `BOOKING_WEBHOOK_URL`, optional `BOOKING_WEBHOOK_SECRET` (HMAC-SHA256 in `X-Signature-SHA256`) |

With neither set, the form is shown but disabled with an explanation, and
the endpoint returns 503. **The home page is static, so redeploy after
adding or changing these variables** — the form's availability is fixed at
build time (Vercel requires a redeploy for new variables anyway).

## Deploy

The Vercel project should use: framework **Next.js**, root directory **`./`**,
build command `next build` (default), production branch **`main`**. No
custom domain is needed: canonical URLs, the sitemap and Open Graph tags use
`VERCEL_PROJECT_PRODUCTION_URL`, which Vercel sets to the project's own
production domain.

## Content rules

- Product facts come from Enagic's documentation; see `docs/content-sources.md`.
- No health, medical, cure, detox or anti-ageing claims.
- Non-drinking waters are labelled in words wherever they appear.
- The site is independent and says so; it is not Enagic's official site.

## Assets to replace

`public/images/k8-front.png` was supplied by the owner. Its on-screen tiles
don't match the K8's documented home screen (see the imagery note in
`docs/content-sources.md`). Replace it with an official Enagic product
photograph when available — same file name, any size ≥ 1200 px.
