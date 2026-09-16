import { technology } from "@/lib/content";
import { TECH_STATIC_CSS } from "@/lib/technology-static-css";
import { TechnologyPanel } from "./TechnologyPanel";
import { TechnologyReveal } from "./TechnologyReveal";
import { TechnologyStage } from "./TechnologyStage";

/**
 * Eight things the K8 does on its own, read one at a time.
 *
 * The list runs down the left; on wide screens a stage stays beside it with
 * the machine, a lit rectangle over the part being described, and that
 * item's illustration — the rectangle moves and the illustrations cross-fade
 * as the reader goes down the list, and the current item's number takes the
 * accent colour. On narrow screens each row simply carries its own
 * illustration. Reduced motion and no-JS get that plain version too.
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

      <div className="container-page pt-[var(--section-y)]">
        <p className="eyebrow text-glacier">{eyebrow}</p>
        <h2 id="technology-title" className="type-display-md mt-5 text-ink" data-tech-heading>
          <span className="tech-line">
            <span>{headline[0]}</span>
          </span>
          <span className="tech-line">
            <span className="type-light text-ink-soft">{headline[1]}</span>
          </span>
        </h2>
      </div>

      <div className="container-page tech-layout pb-[var(--section-y)]" data-tech>
        <ol className="tech-items">
          {items.map((item, i) => (
            <li key={item.id} className="tech-row" data-tech-row={i} data-tech-item={i}>
              <p className="tech-index">
                <span className="tech-index-num">
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
                <span className="tech-index-label"> — {item.label}</span>
              </p>
              <h3 className="tech-headline">{item.headline}</h3>
              <p className="tech-body">{item.body}</p>
              <div className="tech-panel-inline">
                <TechnologyPanel panel={item.panel} />
              </div>
            </li>
          ))}
        </ol>

        <TechnologyStage items={items} />
      </div>

      <div className="container-page pb-[var(--section-y)]">
        <p className="tech-note">{note}</p>
      </div>

      <TechnologyReveal />
    </section>
  );
}
