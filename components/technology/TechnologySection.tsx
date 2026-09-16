import { technology } from "@/lib/content";
import { TECH_STATIC_CSS } from "@/lib/technology-static-css";
import { TechnologyPanel } from "./TechnologyPanel";
import { TechnologyReveal } from "./TechnologyReveal";

/**
 * Eight things the K8 does on its own, read one at a time.
 *
 * Each item is a row: the copy on the left, its illustration on the right.
 * On wide screens the illustration stays with its copy while that row passes
 * (CSS sticky, one row at a time — the pinned story above has already been
 * released by then), and items rise in as they are reached. Reduced motion
 * and no-JS get the same rows, laid out plainly.
 *
 * No navigation, no buttons: the only call to action on the page stays the
 * one in the header.
 */
export function TechnologySection() {
  const { eyebrow, headline, items, note } = technology;
  const total = String(items.length).padStart(2, "0");

  return (
    <section id="technology" aria-labelledby="technology-title" className="bg-white">
      <style dangerouslySetInnerHTML={{ __html: `@media (prefers-reduced-motion: reduce){${TECH_STATIC_CSS}}` }} />
      <noscript dangerouslySetInnerHTML={{ __html: `<style>${TECH_STATIC_CSS}</style>` }} />

      <div className="container-page section-y">
        <p className="eyebrow text-glacier">{eyebrow}</p>
        <h2 id="technology-title" className="type-display-md mt-5 text-ink">
          {headline[0]}
          <span className="type-light text-ink-soft">{headline[1]}</span>
        </h2>

        <ol className="tech-grid mt-12 lg:mt-4" data-tech>
          {items.map((item, i) => (
            <li key={item.id} className="tech-row">
              <div className="tech-item" data-tech-item={i}>
                <p className="tech-index">
                  <span className="tech-index-num">
                    {String(i + 1).padStart(2, "0")} / {total}
                  </span>
                  <span className="tech-index-label"> — {item.label}</span>
                </p>
                <h3 className="tech-headline">{item.headline}</h3>
                <p className="tech-body">{item.body}</p>
              </div>
              <div className="tech-panel-wrap">
                <TechnologyPanel panel={item.panel} />
              </div>
            </li>
          ))}
        </ol>

        <p className="tech-note">{note}</p>
      </div>

      <TechnologyReveal />
    </section>
  );
}
