/**
 * The technology section without its scroll effects: every row in normal
 * reading order, each illustration under its copy, nothing pinned and
 * nothing waiting to be revealed. Used for visitors who prefer reduced
 * motion (inside a media query) and when JavaScript is off (inside
 * <noscript>). One source, so the two can't drift apart.
 *
 * Class names must match components/technology/TechnologySection.tsx.
 */
export const TECH_STATIC_CSS = `
.tech-row{min-height:0}
.tech-item{opacity:1;transform:none;position:relative;top:auto;padding-block:0}
.tech-panel-wrap{opacity:1;position:relative;top:auto;padding-block:0}
`;
