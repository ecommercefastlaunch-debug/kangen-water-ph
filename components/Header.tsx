type HeaderProps = {
  /** Where the wordmark goes: the top of the page, or home from another page. */
  homeHref?: string;
  /** The booking form — on the home page, a same-page jump. */
  bookHref?: string;
};

/**
 * The page's only marketing call to action lives here, and nowhere else.
 * The jump to #book is a plain anchor: smooth scrolling and the offset for
 * this fixed bar come from CSS (scroll-behavior, scroll-padding-top), so it
 * works without JavaScript and respects reduced-motion preferences.
 */
export function Header({ homeHref = "#top", bookHref = "#book" }: HeaderProps) {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-3">
        <a
          href={homeHref}
          className="whitespace-nowrap text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink min-[400px]:text-[12px] min-[400px]:tracking-[0.16em] sm:text-[13px]"
        >
          KANGEN WATER PH
        </a>
        <a
          href={bookHref}
          className="cta-pill inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-ink px-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink hover:bg-ink hover:text-paper min-[400px]:px-4 min-[400px]:text-[11px] min-[400px]:tracking-[0.12em] sm:px-6 sm:text-[12px]"
        >
          BOOK A PRESENTATION
        </a>
      </div>
    </header>
  );
}
