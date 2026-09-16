/**
 * The technology section's styles, from the owner's own portable export of
 * the section on kangen.ph (exports/technology-section.html). Everything is
 * prefixed k8t- and scoped to .k8t, so it cannot collide with the rest of
 * the site, and --k8t-accent re-colours it.
 *
 * Two adaptations: the export assumed a page with no fixed header, so its
 * sticky stage sat at 5svh and now clears this site's header; and a rule for
 * the sources note this site keeps under the section.
 */
export const TECHNOLOGY_CSS = `
/* ===== 1. STYLE BLOCK ===================================================== */
.k8t {
  --k8t-ink: #0e1113;
  --k8t-ink-2: #373e43;
  --k8t-ink-3: #5c666c;
  --k8t-ink-4: #8b949a;
  --k8t-line: #e3e8eb;
  --k8t-paper: #f2f8fa;
  --k8t-accent: #0d6585;         /* the one colour to change */
  --k8t-accent-soft: #3597bd;
  --k8t-gutter: clamp(1.25rem, 0.5rem + 3.2vw, 3.5rem);
  --k8t-ease: cubic-bezier(0.22, 1, 0.36, 1);

  box-sizing: border-box;
  background: #fff;
  color: var(--k8t-ink);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
    "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  letter-spacing: -0.011em;
  -webkit-font-smoothing: antialiased;
}
.k8t *, .k8t *::before, .k8t *::after { box-sizing: inherit; }

.k8t-wrap {
  width: 100%;
  max-width: calc(1600px + 2 * var(--k8t-gutter));
  margin-inline: auto;
  padding-inline: var(--k8t-gutter);
}
.k8t-head { padding-top: clamp(4rem, 3rem + 8vw, 9rem); }
.k8t-eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--k8t-ink-3);
}
.k8t-title {
  margin: 1.25rem 0 0;
  font-size: clamp(2.625rem, 1.1rem + 5.6vw, 6.5rem);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.047em;
  text-wrap: balance;
}

/* ---- layout ---- */
.k8t-grid { padding-bottom: clamp(4rem, 3rem + 8vw, 9rem); }
.k8t-list { list-style: none; margin: 0; padding: 0; }
.k8t-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid var(--k8t-line);
  padding: 3.5rem 0;
}
.k8t-item:last-child { border-bottom: 0; }
.k8t-count {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--k8t-ink-4);
  transition: color 0.5s var(--k8t-ease);
}
.k8t-item.is-active .k8t-count { color: var(--k8t-accent); }
.k8t-statement {
  margin: 1rem 0 0;
  max-width: 16ch;
  font-size: clamp(1.75rem, 1.2rem + 2.2vw, 3.125rem);
  font-weight: 500;
  line-height: 1.06;
  letter-spacing: -0.032em;
  text-wrap: balance;
}
.k8t-detail {
  margin: 1.25rem 0 0;
  max-width: 28rem;
  color: var(--k8t-ink-3);
  text-wrap: pretty;
}

/* the picture that travels with each feature on a phone */
.k8t-inline {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
  padding: 2.5rem 1rem;
  border-radius: 18px;
  background: var(--k8t-paper);
}

/* the machine on narrow screens, where there is no pinned stage */
.k8t-shot {
  margin: 0 auto 3rem;
  max-width: 420px;
  padding: 1.5rem;
  border-radius: 24px;
  background: radial-gradient(70% 60% at 50% 45%, #fff 0%, var(--k8t-paper) 100%);
}
.k8t-shot img { display: block; width: 100%; height: auto; }
@media (min-width: 1024px) { .k8t-shot { display: none; } }

/* each feature rises as it arrives. Only once the script has run, so with
   JavaScript off everything is simply visible. */
.k8t-js .k8t-item {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.8s var(--k8t-ease), transform 0.8s var(--k8t-ease);
}
.k8t-js .k8t-item.is-inview { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .k8t-js .k8t-item { opacity: 1; transform: none; }
}

/* ---- the pinned stage (desktop only) ---- */
.k8t-stage { display: none; }

@media (min-width: 1024px) {
  .k8t-grid {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: 0 2.5rem;
  }
  .k8t-item { min-height: 66svh; border-bottom: 0; padding: 0; }
  .k8t-inline { display: none; }
  .k8t-stage { display: block; }
  .k8t-sticky {
    position: sticky;
    top: calc(var(--header-h, 4.5rem) + 5svh);
    display: flex;
    align-items: center;
    gap: 1.5rem;
    height: 80svh;
    padding: 0 1.5rem;
    overflow: hidden;
    border-radius: 28px;
    background: radial-gradient(70% 60% at 38% 50%, #fff 0%, var(--k8t-paper) 100%);
  }
}

.k8t-product { position: relative; flex: 0 0 62%; aspect-ratio: 1; }
.k8t-product img { display: block; width: 100%; height: 100%; object-fit: contain; }
/* the spotlight: everything outside the box is veiled */
.k8t-spot {
  position: absolute;
  border: 1px solid var(--k8t-accent-soft);
  border-radius: 14px;
  box-shadow: 0 0 0 2000px rgba(242, 248, 250, 0.62);
  transition: all 0.9s var(--k8t-ease);
  pointer-events: none;
}
.k8t-visuals { position: relative; flex: 1; align-self: stretch; }
.k8t-visual {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(1rem);
  transition: opacity 0.7s var(--k8t-ease), transform 0.7s var(--k8t-ease);
  pointer-events: none;
}
.k8t-visual.is-active { opacity: 1; transform: none; }

/* ---- the little pictures ---- */
.k8t-card { width: 220px; text-align: center; }
.k8t-card h3 {
  margin: 1.25rem 0 0;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.22;
}
.k8t-card p { margin: 0.25rem 0 0; font-size: 0.8125rem; color: var(--k8t-ink-3); }
.k8t-big {
  margin: 0;
  font-size: 2.6rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
.k8t-sub { margin: 0.25rem 0 0; color: var(--k8t-ink-3); }
.k8t-mid {
  margin: 1.25rem 0 0;
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}
.k8t-icon { color: var(--k8t-accent); }
.k8t-spin { animation: k8t-spin 6s linear infinite; }

/* voice: a row of bars */
.k8t-wave { display: flex; align-items: center; justify-content: center; gap: 6px; height: 64px; }
.k8t-wave span {
  display: block;
  width: 6px;
  border-radius: 999px;
  background: var(--k8t-accent-soft);
  transform: scaleY(0.35);
  animation: k8t-wave 1.1s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

/* ---- the simulated display ---- */
.k8t-screen {
  width: 180px;
  padding: 12px;
  border-radius: 16px;
  background: #0a0c0f;
  box-shadow: 0 40px 80px -40px rgba(10, 30, 45, 0.55),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  user-select: none;
}
.k8t-brand {
  margin: 0 0 7px;
  text-align: center;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.85);
}
.k8t-brand b { color: #6fb8e6; font-weight: 500; }
.k8t-glass {
  position: relative;
  height: 290px;
  overflow: hidden;
  border-radius: 8px;
  background: linear-gradient(180deg, #0b1320 0%, #0e213d 52%, #1765b0 100%);
}
.k8t-face { position: absolute; inset: 0; padding: 12px 10px 10px; display: flex; flex-direction: column; }
.k8t-mode { margin: 0; text-align: center; font-size: 11px; font-weight: 600; color: #fff; }
.k8t-flow { margin: 4px 0 0; text-align: center; font-size: 9px; letter-spacing: 0.2em; color: #8fd3f5; }
.k8t-flow span { animation: k8t-flow 1.2s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
.k8t-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
.k8t-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 7px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
}
.k8t-tile b { margin-top: 3px; font-size: 8px; font-weight: 600; color: #fff; }
.k8t-tile svg { width: 40%; height: 40%; color: #fff; }
.k8t-set {
  margin: 10px auto 0;
  padding: 2px 12px;
  border-radius: 999px;
  background: #1f4fa3;
  font-size: 8px;
  color: #fff;
}
.k8t-sleep {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 28px;
  background: #050608;
  color: rgba(255, 255, 255, 0.35);
  font-size: 9px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.5s var(--k8t-ease);
}
.k8t-screen.is-asleep .k8t-sleep { opacity: 1; }
.k8t-list-screen { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; }
.k8t-list-screen li {
  border-radius: 5px;
  padding: 2px 6px;
  text-align: center;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.85);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
  transition: background-color 0.3s, color 0.3s;
}
.k8t-list-screen li.is-on { background: #fff; color: #0b1320; font-weight: 600; box-shadow: none; }
.k8t-gauges { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; flex: 1; }
.k8t-gauge { display: flex; flex-direction: column; align-items: center; }
.k8t-bars { display: flex; flex-direction: column-reverse; gap: 4px; width: 100%; flex: 1; }
.k8t-bars i { display: block; flex: 1; border-radius: 3px; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3); }
.k8t-bars i.is-on { background: #8fd3f5; box-shadow: none; }
.k8t-gauge small { margin-top: 6px; font-size: 8px; color: rgba(255, 255, 255, 0.85); text-align: center; }
.k8t-gauge b { font-size: 8px; color: #fff; }

@keyframes k8t-spin { to { transform: rotate(360deg); } }
@keyframes k8t-wave { 0%, 100% { transform: scaleY(0.35); } 50% { transform: scaleY(1); } }
@keyframes k8t-flow { 0%, 100% { opacity: 0.15; } 50% { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .k8t *, .k8t *::before, .k8t *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* This site's own addition: the sources note under the section. */
.k8t-note {
  max-width: 44rem;
  padding-bottom: clamp(3.5rem, 2rem + 6vw, 7rem);
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--k8t-ink-4);
}
`;
