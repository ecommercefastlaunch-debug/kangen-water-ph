import type { TechPanel } from "@/lib/content";

/**
 * The illustration beside each technology item: a stylised display, a short
 * sequence, a figure or a list. Drawn in markup, never a photograph — the
 * machine itself is shown once, in the story above. Screens are captioned as
 * illustrations, because they are not the K8's own software.
 */
export function TechnologyPanel({ panel }: { panel: TechPanel }) {
  switch (panel.kind) {
    case "screen":
      return (
        <figure className="tech-card">
          <div className="tech-screen">
            <p className="tech-screen-title">{panel.title}</p>
            {panel.tiles ? (
              <ul className="tech-tiles">
                {panel.tiles.map((tile) => (
                  <li key={tile} className="tech-tile">
                    {tile}
                  </li>
                ))}
              </ul>
            ) : null}
            {panel.rows ? (
              <dl className="tech-screen-rows">
                {panel.rows.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {panel.lines?.map((line) => (
              <p key={line} className="tech-screen-line">
                {line}
              </p>
            ))}
            {panel.footer ? <p className="tech-screen-footer">{panel.footer}</p> : null}
          </div>
          {panel.caption ? <figcaption className="tech-caption">{panel.caption}</figcaption> : null}
        </figure>
      );

    case "steps":
      return (
        <figure className="tech-card">
          <ol className="tech-steps">
            {panel.steps.map((step, i) => (
              <li key={step}>
                <span className="tech-step-index" aria-hidden="true">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <figcaption className="tech-caption">{panel.caption}</figcaption>
        </figure>
      );

    case "stat":
      return (
        <div className="tech-card">
          <p className="tech-stat">
            {panel.value}
            <span className="tech-stat-unit">{panel.unit}</span>
          </p>
          <dl className="tech-rows">
            {panel.rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case "quote":
      return (
        <figure className="tech-card">
          <p className="tech-quote">{panel.quote}</p>
          <ul className="tech-rows-plain">
            {panel.rows.map((row) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
          <figcaption className="tech-caption">{panel.caption}</figcaption>
        </figure>
      );

    case "list":
      return (
        <figure className="tech-card">
          <ul className="tech-list">
            {panel.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <figcaption className="tech-caption">{panel.caption}</figcaption>
        </figure>
      );
  }
}
