import Image from "next/image";
import { technology } from "@/lib/content";
import { TECHNOLOGY_CSS } from "@/lib/technology-css";
import { visualHtml } from "@/lib/technology-markup";
import front from "@/public/images/k8-stage-alpha.png";
import { TechnologyMotion } from "./TechnologyMotion";

/**
 * Eight things the K8 does on its own.
 *
 * This is the owner's own section from kangen.ph, ported from the portable
 * export they supplied (exports/technology-section.html): the same markup,
 * the same styles, and the same behaviour — on wide screens the machine
 * stays pinned while the features pass, a spotlight moves to the part each
 * feature is about, and the picture beside it changes; on narrow screens the
 * machine is shown once at the top and every feature carries its own
 * picture.
 *
 * What differs here: the photograph is this site's own, the copy is this
 * site's sourced wording (docs/content-sources.md), the illustrations are
 * rendered on the server so they survive with JavaScript off, and the pinned
 * stage clears this site's fixed header.
 */
export function TechnologySection() {
  const { eyebrow, headline, items, note } = technology;
  const total = String(items.length).padStart(2, "0");
  const first = items[0].spotlight;

  return (
    <section className="k8t" id="technology" aria-labelledby="k8t-title">
      <style dangerouslySetInnerHTML={{ __html: TECHNOLOGY_CSS }} />

      <div className="k8t-wrap k8t-head">
        <p className="k8t-eyebrow">{eyebrow}</p>
        <h2 className="k8t-title" id="k8t-title">
          {headline[0]}
          <br />
          {headline[1]}
        </h2>
      </div>

      <div className="k8t-wrap k8t-grid">
        <div className="k8t-shot">
          <Image src={front} alt="" aria-hidden="true" sizes="(min-width: 1024px) 40vw, 90vw" />
        </div>

        <ol className="k8t-list">
          {items.map((item, i) => (
            <li
              key={item.id}
              className={i === 0 ? "k8t-item is-active" : "k8t-item"}
              data-spot={`${item.spotlight.left},${item.spotlight.top},${item.spotlight.width},${item.spotlight.height}`}
            >
              <p className="k8t-count">
                {String(i + 1).padStart(2, "0")} / {total} — {item.label}
              </p>
              <h3 className="k8t-statement">{item.headline}</h3>
              <p className="k8t-detail">{item.body}</p>
              <div className="k8t-inline" data-visual={item.visual} dangerouslySetInnerHTML={{ __html: visualHtml(item.visual) }} />
            </li>
          ))}
        </ol>

        <div className="k8t-stage">
          <div className="k8t-sticky">
            <div className="k8t-product">
              <Image src={front} alt="" aria-hidden="true" sizes="40vw" />
              <span
                className="k8t-spot"
                aria-hidden="true"
                style={{ left: first.left, top: first.top, width: first.width, height: first.height }}
              />
            </div>
            <div className="k8t-visuals" aria-hidden="true">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={i === 0 ? "k8t-visual is-active" : "k8t-visual"}
                  data-visual={item.visual}
                  dangerouslySetInnerHTML={{ __html: visualHtml(item.visual) }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="k8t-wrap">
        <p className="k8t-note">{note}</p>
      </div>

      <TechnologyMotion />
    </section>
  );
}
