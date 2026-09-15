import { disclaimer } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

export function Footer({ homeHref = "#top" }: { homeHref?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-page py-12 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <a href={homeHref} className="text-[13px] font-bold uppercase tracking-[0.16em] text-ink">
            KANGEN WATER PH
          </a>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
            <li>
              <a href="/privacy" className="underline decoration-silver underline-offset-4 hover:decoration-ink">
                Privacy notice
              </a>
            </li>
            <li>
              <a href="#disclaimer" className="underline decoration-silver underline-offset-4 hover:decoration-ink">
                Disclaimer
              </a>
            </li>
          </ul>
        </div>
        <p id="disclaimer" className="mt-10 max-w-3xl text-xs leading-relaxed text-mute">
          {disclaimer}
        </p>
        <p className="mt-6 text-xs text-mute">
          © {year} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
