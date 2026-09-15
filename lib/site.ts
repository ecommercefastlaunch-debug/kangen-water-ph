export const SITE_NAME = "Kangen Water PH";

/**
 * The public origin used for canonical URLs, Open Graph and the sitemap.
 *
 * Never hardcoded. On Vercel, VERCEL_PROJECT_PRODUCTION_URL is set by the
 * platform to the project's actual production domain (e.g. the assigned
 * *.vercel.app domain), so preview builds still point canonicals at
 * production. NEXT_PUBLIC_SITE_URL overrides it when the owner sets one.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return new URL(explicit);

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return new URL(`https://${production}`);

  return new URL(`http://localhost:${process.env.PORT ?? 3000}`);
}
