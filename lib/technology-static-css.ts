/**
 * The technology section without its scroll effects: every row in normal
 * reading order with its own illustration beneath it, the heading already in
 * place, and no stage beside the list. Used for visitors who prefer reduced
 * motion (inside a media query) and when JavaScript is off (inside
 * <noscript>) — without JS nothing would ever mark the current item, so the
 * stage would sit empty.
 *
 * Class names must match components/technology/TechnologySection.tsx.
 */
export const TECH_STATIC_CSS = `
.tech-line > span{transform:none}
.tech-row{min-height:0;padding-block:3rem;border-bottom:1px solid var(--color-line)}
.tech-row:last-child{border-bottom:0}
.tech-panel-inline{display:flex}
.tech-stage{display:none}
`;
